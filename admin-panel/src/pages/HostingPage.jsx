import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getHostings, createHosting, updateHosting, deleteHosting } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TYPES = ['shared','vps','dedicated','cloud','reseller'];
const EMPTY = { type:'shared', name:'', price:'', price_num:'', per:'/month', description:'', storage:'', bandwidth:'', websites:'', emails:'', features:'', is_featured:false, is_active:true, sort_order:0 };

export default function HostingPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await getHostings(); setRows(r.data.data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = typeFilter ? rows.filter(r => r.type === typeFilter) : rows;

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r, features: (r.features||[]).join(', ') }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.type) { showToast('Type, name and price required', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, features: form.features.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing) await updateHosting(editing._id, payload);
      else await createHosting(payload);
      showToast(editing ? 'Plan updated!' : 'Plan created!');
      setModalOpen(false); load();
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hosting plan?')) return;
    try { await deleteHosting(id); showToast('Deleted!'); load(); } catch { showToast('Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AdminLayout title="Hosting Plans">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add Plan</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">🌐 Hosting Plans</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {filtered.length}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Name</th><th>Price</th><th>Storage</th><th>Bandwidth</th><th>Websites</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><span className="empty-state-icon">🌐</span><p>No hosting plans found</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td><span className="badge badge-blue">{r.type}</span></td>
                  <td><strong>{r.name}</strong></td>
                  <td style={{ fontWeight: 700, color: 'var(--green)' }}>{r.price}{r.per}</td>
                  <td>{r.storage || '—'}</td>
                  <td>{r.bandwidth || '—'}</td>
                  <td>{r.websites || '—'}</td>
                  <td>{r.is_featured ? <span className="badge badge-yellow">⭐ Yes</span> : <span className="badge badge-gray">No</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(r)}><FiEdit2 size={14} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(r._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <span className="modal-title">{editing ? '✏️ Edit Plan' : '➕ Add Hosting Plan'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Type *</label>
                  <select className="form-control" value={form.type} onChange={e => f('type', e.target.value)}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name} onChange={e => f('name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Price *</label><input className="form-control" value={form.price} onChange={e => f('price', e.target.value)} placeholder="₹99" /></div>
                <div className="form-group"><label className="form-label">Per</label><input className="form-control" value={form.per} onChange={e => f('per', e.target.value)} placeholder="/month" /></div>
                <div className="form-group"><label className="form-label">Storage</label><input className="form-control" value={form.storage} onChange={e => f('storage', e.target.value)} placeholder="10 GB" /></div>
                <div className="form-group"><label className="form-label">Bandwidth</label><input className="form-control" value={form.bandwidth} onChange={e => f('bandwidth', e.target.value)} placeholder="Unlimited" /></div>
                <div className="form-group"><label className="form-label">Websites</label><input className="form-control" value={form.websites} onChange={e => f('websites', e.target.value)} placeholder="1" /></div>
                <div className="form-group"><label className="form-label">Email Accounts</label><input className="form-control" value={form.emails} onChange={e => f('emails', e.target.value)} placeholder="5" /></div>
                <div className="form-group form-full"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => f('description', e.target.value)} /></div>
                <div className="form-group form-full"><label className="form-label">Features (comma separated)</label><input className="form-control" value={form.features} onChange={e => f('features', e.target.value)} placeholder="Free SSL, Daily Backup, cPanel" /></div>
                <div className="form-group" style={{ display: 'flex', gap: 20, alignItems: 'center', paddingTop: 28 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={!!form.is_featured} onChange={e => f('is_featured', e.target.checked)} /> Featured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={!!form.is_active} onChange={e => f('is_active', e.target.checked)} /> Active
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update Plan' : 'Create Plan')}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
