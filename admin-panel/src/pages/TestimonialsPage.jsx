import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const EMPTY = { name:'', role:'', initials:'', rating:5, quote:'', sort_order:0, is_active:true };

export default function TestimonialsPage() {
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
    try { const r = await getTestimonials(); setRows(r.data.data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.quote) { showToast('Name and quote required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) await updateTestimonial(editing._id, form);
      else await createTestimonial(form);
      showToast(editing ? 'Updated!' : 'Created!');
      setModalOpen(false); load();
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await deleteTestimonial(id); showToast('Deleted!'); load(); } catch { showToast('Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AdminLayout title="Testimonials">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add Testimonial</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">⭐ Testimonials</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {rows.length}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Avatar</th><th>Name</th><th>Role</th><th>Rating</th><th>Quote</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><span className="empty-state-icon">⭐</span><p>No testimonials found</p></div></td></tr>
              ) : rows.map(r => (
                <tr key={r._id}>
                  <td><div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-light))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{r.initials || r.name?.charAt(0)}</div></td>
                  <td><strong>{r.name}</strong></td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{r.role || '—'}</td>
                  <td>{'⭐'.repeat(Math.min(r.rating || 5, 5))}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{r.quote}</td>
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
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? '✏️ Edit Testimonial' : '➕ Add Testimonial'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name} onChange={e => f('name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Role / Company</label><input className="form-control" value={form.role} onChange={e => f('role', e.target.value)} placeholder="CEO, TechCorp" /></div>
                <div className="form-group"><label className="form-label">Initials</label><input className="form-control" value={form.initials} onChange={e => f('initials', e.target.value)} placeholder="AB" maxLength={2} /></div>
                <div className="form-group"><label className="form-label">Rating (1-5)</label>
                  <select className="form-control" value={form.rating} onChange={e => f('rating', parseInt(e.target.value))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
                <div className="form-group form-full"><label className="form-label">Quote *</label><textarea className="form-control" rows={4} value={form.quote} onChange={e => f('quote', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={e => f('sort_order', e.target.value)} /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={!!form.is_active} onChange={e => f('is_active', e.target.checked)} /> Active
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update' : 'Create')}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
