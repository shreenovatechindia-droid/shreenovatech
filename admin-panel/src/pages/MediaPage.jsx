import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getMedia, uploadMedia, deleteMedia } from '../utils/api';
import { FiUpload, FiSearch, FiTrash2, FiExternalLink, FiCopy } from 'react-icons/fi';

const FOLDERS = ['general','payments','portfolio','logos','blogs'];

export default function MediaPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [folder, setFolder]   = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [preview, setPreview] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getMedia(folder ? `folder=${folder}` : '');
      setRows(r.data.data || []);
    } catch {}
    setLoading(false);
  }, [folder]);

  useEffect(() => { load(); }, [load]);

  const filtered = search ? rows.filter(r => r.original_name?.toLowerCase().includes(search.toLowerCase()) || r.filename?.toLowerCase().includes(search.toLowerCase())) : rows;

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder || 'general');
        await uploadMedia(fd);
      }
      showToast(`${files.length} file(s) uploaded!`);
      load();
    } catch (e) { showToast(e?.response?.data?.message || 'Upload failed', 'error'); }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    try { await deleteMedia(id); showToast('Deleted!'); load(); } catch { showToast('Delete failed', 'error'); }
  };

  const copyUrl = (url) => { navigator.clipboard.writeText(url); showToast('URL copied!'); };

  const isImage = (type) => type?.startsWith('image/');
  const fmtSize = (bytes) => bytes > 1024*1024 ? `${(bytes/1024/1024).toFixed(1)} MB` : `${Math.round(bytes/1024)} KB`;

  return (
    <AdminLayout title="Media">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={folder} onChange={e => setFolder(e.target.value)}>
          <option value="">All Folders</option>
          {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <label className={`btn btn-primary ${uploading ? 'disabled' : ''}`} style={{ cursor: 'pointer' }}>
          <FiUpload size={14} /> {uploading ? 'Uploading...' : 'Upload Files'}
          <input type="file" multiple accept="image/*,.pdf,.docx" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">🗂️ Media Library</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {filtered.length}</span>
        </div>
        {loading ? (
          <div className="empty-state" style={{ padding: 48 }}><p>Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: 48 }}><span className="empty-state-icon">🗂️</span><p>No files found</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, padding: 20 }}>
            {filtered.map(r => (
              <div key={r._id} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ height: 110, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => isImage(r.file_type) && setPreview(r)}>
                  {isImage(r.file_type) ? (
                    <img src={r.file_url} alt={r.original_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 36 }}>📄</span>
                  )}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.original_name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{fmtSize(r.file_size || 0)} · {r.folder}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    <button className="btn-icon" style={{ width: 26, height: 26 }} onClick={() => copyUrl(r.file_url)} title="Copy URL"><FiCopy size={11} /></button>
                    <a className="btn-icon" style={{ width: 26, height: 26 }} href={r.file_url} target="_blank" rel="noreferrer" title="Open"><FiExternalLink size={11} /></a>
                    <button className="btn-icon danger" style={{ width: 26, height: 26 }} onClick={() => handleDelete(r._id)} title="Delete"><FiTrash2 size={11} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 20, maxWidth: 700, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{preview.original_name}</span>
              <button className="modal-close" onClick={() => setPreview(null)}>✕</button>
            </div>
            <img src={preview.file_url} alt={preview.original_name} style={{ width: '100%', borderRadius: 10, maxHeight: 500, objectFit: 'contain' }} />
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => copyUrl(preview.file_url)}><FiCopy size={12} /> Copy URL</button>
              <a className="btn btn-outline btn-sm" href={preview.file_url} target="_blank" rel="noreferrer"><FiExternalLink size={12} /> Open</a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
