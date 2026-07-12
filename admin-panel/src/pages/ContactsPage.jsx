import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getContacts, getContact, replyContact, deleteContact } from '../utils/api';
import { FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';

const STATUS_MAP = {
  new:     { label:'New',     cls:'badge-blue'  },
  read:    { label:'Read',    cls:'badge-gray'  },
  replied: { label:'Replied', cls:'badge-green' },
};

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function ContactsPage() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reply, setReply]     = useState('');
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const r = await getContacts(params.toString());
      setRows(r.data.data.contacts || []);
      setTotal(r.data.data.pagination?.total || 0);
      setPage(p);
    } catch {}
    setLoading(false);
  }, [search, status]);

  useEffect(() => { load(1); }, [status]);

  const openView = async id => {
    const r = await getContact(id);
    setSelected(r.data.data);
    setReply('');
    setModalOpen(true);
    load(page);
  };

  const handleReply = async () => {
    if (!reply.trim()) { showToast('Please enter a reply', 'error'); return; }
    setSaving(true);
    try {
      await replyContact(selected.id, reply);
      showToast('Reply sent! ✅');
      setModalOpen(false);
      load(page);
    } catch { showToast('Failed to send reply', 'error'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this message?')) return;
    await deleteContact(id);
    showToast('Message deleted');
    load(page);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout title="Contact Messages">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color:'var(--muted)', flexShrink:0 }} />
          <input
            placeholder="Search by name, email, message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(1)}
          />
        </div>
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Messages</span>
          <span style={{ fontSize:13, color:'var(--muted)' }}>Total: {total}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><span className="empty-state-icon">✉️</span><p>No messages found</p></div></td></tr>
              ) : rows.map(c => (
                <tr key={c.id} style={{ fontWeight: c.status === 'new' ? 700 : 400 }}>
                  <td>{c.name}</td>
                  <td style={{ fontSize:12 }}>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.message}</td>
                  <td><span className={`badge ${STATUS_MAP[c.status]?.cls || 'badge-gray'}`}>{STATUS_MAP[c.status]?.label || c.status}</span></td>
                  <td>{fmtDate(c.created_at)}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn-icon" onClick={() => openView(c.id)} title="View & Reply"><FiEye size={14} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(c.id)} title="Delete"><FiTrash2 size={14} /></button>
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

      {/* View/Reply Modal */}
      {modalOpen && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Message from {selected.name}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid" style={{ marginBottom:16 }}>
                {[['Name',selected.name],['Email',selected.email],['Phone',selected.phone||'—'],['Status',selected.status],['Date',fmtDate(selected.created_at)]].map(([k,v]) => (
                  <div className="detail-item" key={k}>
                    <div className="detail-key">{k}</div>
                    <div className="detail-val">{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--bg)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
                <div className="detail-key" style={{ marginBottom:8 }}>Message</div>
                <p style={{ fontSize:14, lineHeight:1.6 }}>{selected.message}</p>
              </div>
              {selected.reply_text && (
                <div style={{ background:'var(--green-bg)', border:'1px solid var(--green-border)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
                  <div className="detail-key" style={{ marginBottom:8, color:'var(--green)' }}>Previous Reply</div>
                  <p style={{ fontSize:13.5 }}>{selected.reply_text}</p>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Reply Message</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Type your reply here..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleReply} disabled={saving}>
                {saving ? 'Sending...' : '📨 Send Reply'}
              </button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
