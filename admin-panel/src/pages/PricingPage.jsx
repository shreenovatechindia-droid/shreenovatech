import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getPricings, createPricing, updatePricing, deletePricing } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const EMPTY = { name:'', description:'', price:'', price_num:'', renewal:'/month', badge:'', badge_class:'badge-blue', features:'', is_featured:false, sort_order:0, is_active:true };

export default function PricingPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await getPricings(); setRows(r.data.data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r, features: (r.features||[]).join('\n') }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) { showToast('Name and price required', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, features: form.features.split('\n').map(s => s.trim()).filter(Boolean) };
      if (editing) await updatePricing(editing._id, payload);
      else await createPricing(payload);
      showToast(editing ? 'Plan updated!' : 'Plan created!');
      setModalOpen(false); load();
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try { await deletePricing(id); showToast('Deleted!'); load(); } catch { showToast('Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AdminLayout title="Pricing">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add Plan</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">💰 Pricing Plans</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {rows.length}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Price</th><th>Renewal</th><th>Features</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><span className="empty-state-icon">💰</span><p>No plans found</p></div></td></tr>
              ) : rows.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.name}</strong>{r.badge && <span className={`badge ${r.badge_class || 'badge-blue'}`} style={{ marginLeft: 6 }}>{r.badge}</span>}</td>
                  <td style={{ fontWeight: 700, color: 'var(--green)' }}>{r.price}</td>
                  <td>{r.renewal || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{(r.features || []).length} features</td>
                  <td>{r.is_featured ? <span className="badge badge-yellow">⭐ Yes</span> : <span className="badge badge-gray">No</span>}</td>
                  <td>{r.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}</td>
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
              <span className="modal-title">{editing ? '✏️ Edit Plan' : '➕ Add Plan'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Plan Name *</label><input className="form-control" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Silver Package" /></div>
                <div className="form-group"><label className="form-label">Price *</label><input className="form-control" value={form.price} onChange={e => f('price', e.target.value)} placeholder="e.g. ₹9,999" /></div>
                <div className="form-group"><label className="form-label">Price (Number)</label><input type="number" className="form-control" value={form.price_num} onChange={e => f('price_num', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Renewal</label><input className="form-control" value={form.renewal} onChange={e => f('renewal', e.target.value)} placeholder="/month" /></div>
                <div className="form-group"><label className="form-label">Badge Text</label><input className="form-control" value={form.badge} onChange={e => f('badge', e.target.value)} placeholder="e.g. Popular" /></div>
                <div className="form-group"><label className="form-label">Badge Class</label>
                  <select className="form-control" value={form.badge_class} onChange={e => f('badge_class', e.target.value)}>
                    <option value="badge-blue">Blue</option><option value="badge-green">Green</option>
                    <option value="badge-yellow">Yellow</option><option value="badge-red">Red</option>
                  </select>
                </div>
                <div className="form-group form-full"><label className="form-label">Description</label><textarea className="form-control" rows={2} value={form.description} onChange={e => f('description', e.target.value)} /></div>
                <div className="form-group form-full"><label className="form-label">Features (one per line)</label><textarea className="form-control" rows={6} value={form.features} onChange={e => f('features', e.target.value)} placeholder="5 Pages Website&#10;Responsive Design&#10;1 Year Hosting" /></div>
                <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={e => f('sort_order', e.target.value)} /></div>
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
