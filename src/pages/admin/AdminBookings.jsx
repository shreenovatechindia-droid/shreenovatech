import { useState, useEffect, useRef } from 'react';
import { getBookings, getBooking, updateBookingStatus, deleteBooking } from '../../utils/api';
import { toast } from './Toast';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const fmtDateTime = d => d ? new Date(d).toLocaleString('en-IN') : '—';

function StatusBadge({ status }) {
  const map = { new:'blue', contacted:'blue', in_progress:'purple', completed:'green', cancelled:'red' };
  return <span className={`adm-badge adm-badge-${map[status] || 'gray'}`}>{status?.replace(/_/g, ' ')}</span>;
}

export default function AdminBookings() {
  const [bookings, setBookings]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading]     = useState(true);
  const debounce = useRef(null);

  async function load(p = 1) {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 20, ...(search && { search }), ...(status && { status }) });
    try {
      const res = await getBookings(params.toString());
      if (res.data?.success) {
        setBookings(res.data.data.bookings);
        setPagination(res.data.data.pagination);
        setPage(p);
      }
    } catch { toast('Load failed', 'error'); }
    setLoading(false);
  }

  useEffect(() => { load(1); }, [status]);
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(1), 400);
  }, [search]);

  async function openView(id) {
    const res = await getBooking(id);
    if (res.data?.success) { setSelected(res.data.data); setNewStatus(res.data.data.status); }
  }

  async function handleStatusUpdate() {
    const res = await updateBookingStatus(selected.id, newStatus);
    if (res.data?.success) { toast('Status updated!'); setSelected(null); load(page); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this booking?')) return;
    const res = await deleteBooking(id);
    if (res.data?.success) { toast('Booking deleted'); load(page); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  function exportCSV() {
    const rows = [['Ref ID','Name','Email','Mobile','Project','Budget','Status','Date'],
      ...bookings.map(b => [b.ref_id, b.full_name, b.email, b.mobile, b.project_type||'', b.budget||'', b.status, fmtDate(b.created_at)])];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'bookings.csv'; a.click();
  }

  return (
    <div>
      <div className="adm-filter">
        <div className="adm-search">
          <span>🔍</span>
          <input placeholder="Search name, email, mobile, ref..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={exportCSV}>📥 Export CSV</button>
        <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => load(1)}>🔄</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">All Bookings</span>
          {pagination && <span style={{ fontSize:'12px', color:'#64748b' }}>Total: {pagination.total}</span>}
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Ref ID</th><th>Customer</th><th>Project</th><th>Budget</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div></td></tr>
              ) : bookings.length ? bookings.map(b => (
                <tr key={b.id}>
                  <td><code style={{ fontSize:'11px', background:'#f1f5f9', padding:'2px 6px', borderRadius:'4px' }}>{b.ref_id}</code></td>
                  <td><strong>{b.full_name}</strong><br /><small style={{ color:'#64748b' }}>{b.email} · {b.mobile}</small></td>
                  <td>{b.project_type || '—'}</td>
                  <td>{b.budget || '—'}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>{fmtDate(b.created_at)}</td>
                  <td style={{ display:'flex', gap:'6px' }}>
                    <button className="adm-btn-icon" onClick={() => openView(b.id)} title="View">👁️</button>
                    <button className="adm-btn-icon" onClick={() => handleDelete(b.id)} title="Delete" style={{ color:'#ef4444' }}>🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty-icon">📋</div><p>No bookings found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination && (
          <div className="adm-pagination">
            <button className="adm-page-btn" disabled={page <= 1} onClick={() => load(page - 1)}>‹</button>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
              .filter(p => Math.abs(p - page) <= 2)
              .map(p => <button key={p} className={`adm-page-btn${p === page ? ' active' : ''}`} onClick={() => load(p)}>{p}</button>)}
            <button className="adm-page-btn" disabled={page >= pagination.last_page} onClick={() => load(page + 1)}>›</button>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selected && (
        <div className="adm-modal-bg" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="adm-modal adm-modal-lg">
            <div className="adm-modal-header">
              <span className="adm-modal-title">Booking Details — {selected.ref_id}</span>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-grid">
                {[['Ref ID',selected.ref_id],['Full Name',selected.full_name],['Mobile',selected.mobile],['WhatsApp',selected.whatsapp||'—'],['Email',selected.email],['Company',selected.company||'—'],['City',selected.city||'—'],['State',selected.state||'—'],['Project Type',selected.project_type||'—'],['Budget',selected.budget||'—'],['Timeline',selected.timeline||'—'],['Status',selected.status]].map(([k,v]) => (
                  <div key={k} className="adm-detail-item">
                    <div className="adm-detail-label">{k}</div>
                    <div className="adm-detail-value">{v}</div>
                  </div>
                ))}
              </div>
              {selected.description && (
                <div style={{ marginTop:'14px', background:'#f8fafc', borderRadius:'8px', padding:'12px' }}>
                  <div className="adm-detail-label">Description</div>
                  <p style={{ fontSize:'13px', marginTop:'4px' }}>{selected.description}</p>
                </div>
              )}
              <div style={{ marginTop:'16px', display:'flex', alignItems:'center', gap:'10px' }}>
                <label className="adm-label">Update Status:</label>
                <select className="adm-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={handleStatusUpdate}>Update Status</button>
              <button className="adm-btn adm-btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
