import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '../utils/api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

const CATS = ['All','web','mobile','ecommerce','branding','seo','other'];
const EMPTY = { title:'', category:'web', badge:'', industry:'', description:'', features:'', tech:'', image_url:'', live_url:'', github_url:'', client_name:'', completion_date:'', is_featured:false, sort_order:0, is_active:true };

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast-container">
      <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>
    </div>
  );
}

export default function PortfolioPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [imgFile, setImgFile] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await getPortfolios(); setRows(r.data.data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter(r => {
    const matchCat = cat === 'All' || r.category === cat;
    const matchSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) || r.client_name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImgFile(null); setModalOpen(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ ...r, features: (r.features||[]).join(', '), tech: (r.tech||[]).join(', '), completion_date: r.completion_date ? r.completion_date.slice(0,10) : '' });
    setImgFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) { showToast('Title and category required', 'error'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);
      if (editing) await updatePortfolio(editing._id, fd);
      else await createPortfolio(fd);
      showToast(editing ? 'Project updated!' : 'Project created!');
      setModalOpen(false);
      load();
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await deletePortfolio(id); showToast('Deleted!'); load(); } catch { showToast('Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AdminLayout title="Portfolio">
      <Toast toast={toast} />
      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={cat} onChange={e => setCat(e.target.value)}>
          {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add Project</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">🖼️ Portfolio Projects</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {filtered.length}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Client</th><th>Tech</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><span className="empty-state-icon">🖼️</span><p>No projects found</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    {r.image_url ? <img src={r.image_url} alt={r.title} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} /> : <div style={{ width: 48, height: 36, background: 'var(--bg)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🖼️</div>}
                  </td>
                  <td><strong>{r.title}</strong>{r.badge && <span className="badge badge-blue" style={{ marginLeft: 6, fontSize: 10 }}>{r.badge}</span>}</td>
                  <td><span className="badge badge-gray">{r.category}</span></td>
                  <td>{r.client_name || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 120 }}>{(r.tech || []).slice(0, 3).join(', ')}{r.tech?.length > 3 ? '...' : ''}</td>
                  <td>{r.is_featured ? <span className="badge badge-yellow">⭐ Yes</span> : <span className="badge badge-gray">No</span>}</td>
                  <td>{r.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(r)} title="Edit"><FiEdit2 size={14} /></button>
                      {r.live_url && <a className="btn-icon" href={r.live_url} target="_blank" rel="noreferrer" title="View Live"><FiExternalLink size={14} /></a>}
                      <button className="btn-icon danger" onClick={() => handleDelete(r._id)} title="Delete"><FiTrash2 size={14} /></button>
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
              <span className="modal-title">{editing ? '✏️ Edit Project' : '➕ Add Project'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e => f('title', e.target.value)} placeholder="Project title" /></div>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-control" value={form.category} onChange={e => f('category', e.target.value)}>
                    {CATS.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Badge</label><input className="form-control" value={form.badge} onChange={e => f('badge', e.target.value)} placeholder="e.g. New, Featured" /></div>
                <div className="form-group"><label className="form-label">Industry</label><input className="form-control" value={form.industry} onChange={e => f('industry', e.target.value)} placeholder="e.g. Healthcare" /></div>
                <div className="form-group"><label className="form-label">Client Name</label><input className="form-control" value={form.client_name} onChange={e => f('client_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Completion Date</label><input type="date" className="form-control" value={form.completion_date} onChange={e => f('completion_date', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Live URL</label><input className="form-control" value={form.live_url} onChange={e => f('live_url', e.target.value)} placeholder="https://" /></div>
                <div className="form-group"><label className="form-label">GitHub URL</label><input className="form-control" value={form.github_url} onChange={e => f('github_url', e.target.value)} placeholder="https://github.com/..." /></div>
                <div className="form-group form-full"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e => f('description', e.target.value)} /></div>
                <div className="form-group form-full"><label className="form-label">Technologies (comma separated)</label><input className="form-control" value={form.tech} onChange={e => f('tech', e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
                <div className="form-group form-full"><label className="form-label">Features (comma separated)</label><input className="form-control" value={form.features} onChange={e => f('features', e.target.value)} placeholder="Responsive, Fast, SEO" /></div>
                <div className="form-group"><label className="form-label">Project Image</label><input type="file" className="form-control" accept="image/*" onChange={e => setImgFile(e.target.files[0])} /></div>
                <div className="form-group"><label className="form-label">Image URL (if no upload)</label><input className="form-control" value={form.image_url} onChange={e => f('image_url', e.target.value)} placeholder="https://..." /></div>
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
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update Project' : 'Create Project')}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
