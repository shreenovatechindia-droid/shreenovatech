import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const EMPTY = { category:'general', question:'', answer:'', sort_order:0, is_active:true };

export default function FaqsPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await getFaqs(); setRows(r.data.data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = [...new Set(rows.map(r => r.category).filter(Boolean))];

  const filtered = rows.filter(r => {
    const matchCat = !catFilter || r.category === catFilter;
    const matchSearch = !search || r.question?.toLowerCase().includes(search.toLowerCase()) || r.answer?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.question || !form.answer) { showToast('Question and answer required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) await updateFaq(editing._id, form);
      else await createFaq(form);
      showToast(editing ? 'FAQ updated!' : 'FAQ created!');
      setModalOpen(false); load();
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try { await deleteFaq(id); showToast('Deleted!'); load(); } catch { showToast('Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AdminLayout title="FAQs">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input placeholder="Search FAQs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add FAQ</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">❓ FAQs</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {filtered.length}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Category</th><th>Question</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><span className="empty-state-icon">❓</span><p>No FAQs found</p></div></td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r._id}>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{i + 1}</td>
                  <td><span className="badge badge-blue">{r.category}</span></td>
                  <td>
                    <strong style={{ fontSize: 13 }}>{r.question}</strong>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.answer}</div>
                  </td>
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
              <span className="modal-title">{editing ? '✏️ Edit FAQ' : '➕ Add FAQ'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e => f('category', e.target.value)} placeholder="general, pricing, technical..." /></div>
              <div className="form-group"><label className="form-label">Question *</label><input className="form-control" value={form.question} onChange={e => f('question', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Answer *</label><textarea className="form-control" rows={5} value={form.answer} onChange={e => f('answer', e.target.value)} /></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-control" value={form.sort_order} onChange={e => f('sort_order', e.target.value)} /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={!!form.is_active} onChange={e => f('is_active', e.target.checked)} /> Active
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update FAQ' : 'Create FAQ')}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
