import { useState, useEffect, useRef } from 'react';
import { getContacts, getContact, replyContact, deleteContact } from '../../utils/api';
import { toast } from './Toast';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const fmtDateTime = d => d ? new Date(d).toLocaleString('en-IN') : '—';

function StatusBadge({ status }) {
  const map = { new:'blue', read:'gray', replied:'green' };
  return <span className={`adm-badge adm-badge-${map[status] || 'gray'}`}>{status}</span>;
}

export default function AdminContacts() {
  const [contacts, setContacts]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [reply, setReply]         = useState('');
  const [loading, setLoading]     = useState(true);
  const debounce = useRef(null);

  async function load(p = 1) {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 20, ...(search && { search }), ...(status && { status }) });
    try {
      const res = await getContacts(params.toString());
      if (res.data?.success) { setContacts(res.data.data.contacts); setPagination(res.data.data.pagination); setPage(p); }
    } catch { toast('Load failed', 'error'); }
    setLoading(false);
  }

  useEffect(() => { load(1); }, [status]);
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(1), 400);
  }, [search]);

  async function openView(id) {
    const res = await getContact(id);
    if (res.data?.success) { setSelected(res.data.data); setReply(''); load(page); }
  }

  async function handleReply() {
    if (!reply.trim()) { toast('Reply likhna zaroori hai', 'error'); return; }
    const res = await replyContact(selected.id, reply);
    if (res.data?.success) { toast('Reply save ho gaya! ✅'); setSelected(null); load(page); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this message?')) return;
    const res = await deleteContact(id);
    if (res.data?.success) { toast('Message deleted'); load(page); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  return (
    <div>
      <div className="adm-filter">
        <div className="adm-search">
          <span>🔍</span>
          <input placeholder="Search name, email, message..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => load(1)}>🔄</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">All Messages</span>
          {pagination && <span style={{ fontSize:'12px', color:'#64748b' }}>Total: {pagination.total}</span>}
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div></td></tr>
              ) : contacts.length ? contacts.map(c => (
                <tr key={c.id} style={{ fontWeight: c.status === 'new' ? '600' : 'normal' }}>
                  <td>{c.name}</td>
                  <td style={{ fontSize:'12px' }}>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td style={{ maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.message}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{fmtDate(c.created_at)}</td>
                  <td style={{ display:'flex', gap:'6px' }}>
                    <button className="adm-btn-icon" onClick={() => openView(c.id)}>👁️</button>
                    <button className="adm-btn-icon" onClick={() => handleDelete(c.id)} style={{ color:'#ef4444' }}>🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty-icon">✉️</div><p>No messages found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination && (
          <div className="adm-pagination">
            <button className="adm-page-btn" disabled={page <= 1} onClick={() => load(page - 1)}>‹</button>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2)
              .map(p => <button key={p} className={`adm-page-btn${p === page ? ' active' : ''}`} onClick={() => load(p)}>{p}</button>)}
            <button className="adm-page-btn" disabled={page >= pagination.last_page} onClick={() => load(page + 1)}>›</button>
          </div>
        )}
      </div>

      {selected && (
        <div className="adm-modal-bg" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="adm-modal">
            <div className="adm-modal-header">
              <span className="adm-modal-title">Message from {selected.name}</span>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-grid" style={{ marginBottom:'14px' }}>
                {[['Name',selected.name],['Email',selected.email],['Phone',selected.phone||'—'],['Status',selected.status],['Date',fmtDateTime(selected.created_at)]].map(([k,v]) => (
                  <div key={k} className="adm-detail-item"><div className="adm-detail-label">{k}</div><div className="adm-detail-value">{v}</div></div>
                ))}
              </div>
              <div style={{ background:'#f8fafc', borderRadius:'8px', padding:'12px', marginBottom:'14px' }}>
                <div className="adm-detail-label" style={{ marginBottom:'6px' }}>Message</div>
                <p style={{ fontSize:'13.5px', lineHeight:'1.6' }}>{selected.message}</p>
              </div>
              {selected.reply_text && (
                <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'8px', padding:'12px', marginBottom:'14px' }}>
                  <div className="adm-detail-label" style={{ color:'#15803d', marginBottom:'6px' }}>Previous Reply</div>
                  <p style={{ fontSize:'13px' }}>{selected.reply_text}</p>
                </div>
              )}
              <div className="adm-form-group">
                <label className="adm-label">Reply Message</label>
                <textarea className="adm-input" rows="4" placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} />
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={handleReply}>📨 Send Reply</button>
              <button className="adm-btn adm-btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
