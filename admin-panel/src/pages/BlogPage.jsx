import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../utils/api';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const EMPTY = { title:'', slug:'', excerpt:'', content:'', image_url:'', category:'general', tags:'', status:'draft', is_active:true };

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function BlogPage() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const r = await getBlogs(`page=${p}&limit=20`);
      setRows(r.data.data.blogs || []);
      setTotal(r.data.data.pagination?.total || 0);
      setPage(p);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(1); }, [load]);

  const filtered = search ? rows.filter(r => r.title?.toLowerCase().includes(search.toLowerCase())) : rows;

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = async (id) => {
    try {
      const r = await getBlog(id);
      const b = r.data.data;
      setEditing(b);
      setForm({ ...b, tags: (b.tags||[]).join(', ') });
      setModalOpen(true);
    } catch { showToast('Failed to load blog', 'error'); }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { showToast('Title and content required', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean), slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
      if (editing) await updateBlog(editing._id, payload);
      else await createBlog(payload);
      showToast(editing ? 'Blog updated!' : 'Blog created!');
      setModalOpen(false); load(page);
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try { await deleteBlog(id); showToast('Deleted!'); load(page); } catch { showToast('Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout title="Blog">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input placeholder="Search blogs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> New Post</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📝 Blog Posts</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {total}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Tags</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><span className="empty-state-icon">📝</span><p>No blog posts found</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <strong>{r.title}</strong>
                    {r.excerpt && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.excerpt}</div>}
                  </td>
                  <td><span className="badge badge-blue">{r.category || 'general'}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{(r.tags||[]).slice(0,2).join(', ')}</td>
                  <td>{r.is_active ? <span className="badge badge-green">Published</span> : <span className="badge badge-yellow">Draft</span>}</td>
                  <td>{fmtDate(r.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(r._id)} title="Edit"><FiEdit2 size={14} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(r._id)} title="Delete"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => load(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg" style={{ maxWidth: 800 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? '✏️ Edit Post' : '➕ New Blog Post'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <div className="form-grid">
                <div className="form-group form-full"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e => f('title', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Slug (auto-generated)</label><input className="form-control" value={form.slug} onChange={e => f('slug', e.target.value)} placeholder="leave-blank-for-auto" /></div>
                <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category} onChange={e => f('category', e.target.value)} placeholder="general, tech, news" /></div>
                <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-control" value={form.tags} onChange={e => f('tags', e.target.value)} placeholder="react, nodejs, web" /></div>
                <div className="form-group"><label className="form-label">Featured Image URL</label><input className="form-control" value={form.image_url} onChange={e => f('image_url', e.target.value)} placeholder="https://..." /></div>
                <div className="form-group"><label className="form-label">Status</label>
                  <select className="form-control" value={form.is_active ? 'published' : 'draft'} onChange={e => f('is_active', e.target.value === 'published')}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="form-group form-full"><label className="form-label">Excerpt</label><textarea className="form-control" rows={2} value={form.excerpt} onChange={e => f('excerpt', e.target.value)} placeholder="Short description..." /></div>
                <div className="form-group form-full"><label className="form-label">Content *</label><textarea className="form-control" rows={10} value={form.content} onChange={e => f('content', e.target.value)} placeholder="Write your blog content here..." /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update Post' : 'Publish Post')}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
