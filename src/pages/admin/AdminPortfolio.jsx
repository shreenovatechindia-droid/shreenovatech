import { useState, useEffect } from 'react';
import { getPortfolio, createPortfolio, updatePortfolio, deletePortfolio } from '../../utils/api';
import { toast } from './Toast';

const EMPTY = { title:'', category:'Websites', badge:'', industry:'', description:'', image_url:'', live_url:'', client_name:'', completion_date:'', features:'', tech:'', sort_order:0, is_featured:false, is_active:true };

export default function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch]     = useState('');
  const [cat, setCat]           = useState('');
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [loading, setLoading]   = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getPortfolio('');
      if (res.data?.success) setProjects(res.data.data);
    } catch { toast('Load failed', 'error'); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = projects.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
    (!cat || p.category === cat)
  );

  function openAdd() { setForm(EMPTY); setEditId(null); setModal(true); }
  function openEdit(p) {
    setForm({ ...p, features: (p.features || []).join(', '), tech: (p.tech || []).join(', '), is_featured: !!p.is_featured, is_active: !!p.is_active });
    setEditId(p.id); setModal(true);
  }

  async function handleSave() {
    if (!form.title || !form.category) { toast('Title aur category required hai', 'error'); return; }
    const payload = { ...form, features: form.features.split(',').map(s => s.trim()).filter(Boolean), tech: form.tech.split(',').map(s => s.trim()).filter(Boolean), is_featured: form.is_featured ? 1 : 0, is_active: form.is_active ? 1 : 0 };
    try {
      const res = editId ? await updatePortfolio(editId, payload) : await createPortfolio(payload);
      if (res.data?.success) { toast(editId ? 'Project updated!' : 'Project created!'); setModal(false); load(); }
      else toast(res.data?.message || 'Failed', 'error');
    } catch { toast('Error', 'error'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return;
    const res = await deletePortfolio(id);
    if (res.data?.success) { toast('Project deleted'); load(); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <div className="adm-filter">
        <div className="adm-search"><span>🔍</span><input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="adm-select" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">All Categories</option>
          {['Websites','E-Commerce','Landing Pages','SEO Projects','Branding'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={openAdd}>+ Add Project</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">All Projects</span>
          <span style={{ fontSize:'12px', color:'#64748b' }}>Total: {filtered.length}</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Industry</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div></td></tr>
              ) : filtered.length ? filtered.map(p => (
                <tr key={p.id}>
                  <td><img src={p.image_url || ''} alt="" style={{ width:'56px', height:'38px', objectFit:'cover', borderRadius:'6px', border:'1px solid #e2e8f0' }} onError={e => e.target.style.display='none'} /></td>
                  <td><strong>{p.title}</strong><br /><small style={{ color:'#64748b' }}>{p.badge}</small></td>
                  <td><span className="adm-badge adm-badge-blue">{p.category}</span></td>
                  <td>{p.industry || '—'}</td>
                  <td>{p.is_featured ? '⭐' : '—'}</td>
                  <td>{p.is_active ? <span className="adm-badge adm-badge-green">Active</span> : <span className="adm-badge adm-badge-gray">Inactive</span>}</td>
                  <td style={{ display:'flex', gap:'6px' }}>
                    <button className="adm-btn-icon" onClick={() => openEdit(p)}>✏️</button>
                    <button className="adm-btn-icon" onClick={() => handleDelete(p.id)} style={{ color:'#ef4444' }}>🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty-icon">🖼️</div><p>No projects found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="adm-modal-bg" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="adm-modal adm-modal-lg">
            <div className="adm-modal-header">
              <span className="adm-modal-title">{editId ? 'Edit Project' : 'Add Project'}</span>
              <button className="adm-modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Title *</label><input className="adm-input" value={form.title} onChange={e => f('title', e.target.value)} /></div>
                <div className="adm-form-group"><label className="adm-label">Category *</label>
                  <select className="adm-input" value={form.category} onChange={e => f('category', e.target.value)}>
                    {['Websites','E-Commerce','Landing Pages','SEO Projects','Branding'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Badge</label><input className="adm-input" value={form.badge} onChange={e => f('badge', e.target.value)} /></div>
                <div className="adm-form-group"><label className="adm-label">Industry</label><input className="adm-input" value={form.industry} onChange={e => f('industry', e.target.value)} /></div>
              </div>
              <div className="adm-form-row full">
                <div className="adm-form-group"><label className="adm-label">Description</label><textarea className="adm-input" rows="3" value={form.description} onChange={e => f('description', e.target.value)} /></div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Image URL</label><input className="adm-input" placeholder="/p1.jpg" value={form.image_url} onChange={e => f('image_url', e.target.value)} /></div>
                <div className="adm-form-group"><label className="adm-label">Live URL</label><input className="adm-input" placeholder="https://..." value={form.live_url} onChange={e => f('live_url', e.target.value)} /></div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Features (comma separated)</label><input className="adm-input" value={form.features} onChange={e => f('features', e.target.value)} /></div>
                <div className="adm-form-group"><label className="adm-label">Technologies (comma separated)</label><input className="adm-input" value={form.tech} onChange={e => f('tech', e.target.value)} /></div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Sort Order</label><input className="adm-input" type="number" value={form.sort_order} onChange={e => f('sort_order', parseInt(e.target.value) || 0)} /></div>
                <div className="adm-form-group" style={{ flexDirection:'row', alignItems:'flex-end', gap:'20px', paddingBottom:'4px' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                    <input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured', e.target.checked)} /> Featured
                  </label>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)} /> Active
                  </label>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={handleSave}>💾 Save Project</button>
              <button className="adm-btn adm-btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
