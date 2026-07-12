import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getBookings, getBooking, updateBookingStatus, deleteBooking } from '../utils/api';
import { FiSearch, FiRefreshCw, FiEye, FiTrash2, FiDownload } from 'react-icons/fi';

const STATUS_OPTIONS = ['new','contacted','in_progress','completed','cancelled'];
const STATUS_MAP = {
  new:         { label:'New',         cls:'badge-blue'   },
  contacted:   { label:'Contacted',   cls:'badge-yellow' },
  in_progress: { label:'In Progress', cls:'badge-orange' },
  completed:   { label:'Completed',   cls:'badge-green'  },
  cancelled:   { label:'Cancelled',   cls:'badge-red'    },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'badge-gray' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function BookingsPage() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
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
      const r = await getBookings(params.toString());
      setRows(r.data.data.bookings || []);
      setTotal(r.data.data.pagination?.total || 0);
      setPage(p);
    } catch {}
    setLoading(false);
  }, [search, status]);

  useEffect(() => { load(1); }, [status]);

  const openView = async id => {
    const r = await getBooking(id);
    setSelected(r.data.data);
    setNewStatus(r.data.data.status);
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await updateBookingStatus(selected.id, newStatus);
      showToast('Status updated!');
      setModalOpen(false);
      load(page);
    } catch { showToast('Failed to update', 'error'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this booking?')) return;
    await deleteBooking(id);
    showToast('Booking deleted');
    load(page);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout title="Bookings">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color:'var(--muted)', flexShrink:0 }} />
          <input
            placeholder="Search by name, email, mobile, ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(1)}
          />
        </div>
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => load(1)}>
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Bookings</span>
          <span style={{ fontSize:13, color:'var(--muted)' }}>Total: {total}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ref ID</th><th>Customer</th><th>Project</th>
                <th>Budget</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><span className="empty-state-icon">📋</span><p>No bookings found</p></div></td></tr>
              ) : rows.map(b => (
                <tr key={b.id}>
                  <td><code style={{ fontSize:11, background:'var(--bg)', padding:'2px 6px', borderRadius:4 }}>{b.ref_id}</code></td>
                  <td>
                    <strong>{b.full_name}</strong><br />
                    <small style={{ color:'var(--muted)' }}>{b.email} · {b.mobile}</small>
                  </td>
                  <td>{b.project_type || '—'}</td>
                  <td>{b.budget || '—'}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>{fmtDate(b.created_at)}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn-icon" onClick={() => openView(b.id)} title="View"><FiEye size={14} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(b.id)} title="Delete"><FiTrash2 size={14} /></button>
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

      {/* View Modal */}
      {modalOpen && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <span className="modal-title">Booking Details — {selected.ref_id}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                {[
                  ['Ref ID', selected.ref_id], ['Full Name', selected.full_name],
                  ['Mobile', selected.mobile], ['Email', selected.email],
                  ['Company', selected.company || '—'], ['Project Type', selected.project_type || '—'],
                  ['Budget', selected.budget || '—'], ['Timeline', selected.timeline || '—'],
                  ['City', selected.city || '—'], ['Country', selected.country || '—'],
                  ['Status', selected.status], ['Date', fmtDate(selected.created_at)],
                ].map(([k, v]) => (
                  <div className="detail-item" key={k}>
                    <div className="detail-key">{k}</div>
                    <div className="detail-val">{v}</div>
                  </div>
                ))}
              </div>
              {selected.description && (
                <div style={{ marginTop:16, background:'var(--bg)', borderRadius:10, padding:'14px 16px' }}>
                  <div className="detail-key" style={{ marginBottom:8 }}>Description</div>
                  <p style={{ fontSize:13.5, lineHeight:1.6 }}>{selected.description}</p>
                </div>
              )}
              {selected.services?.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <div className="detail-key" style={{ marginBottom:8 }}>Services</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {selected.services.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                  </div>
                </div>
              )}
              <div style={{ marginTop:20 }}>
                <label className="form-label">Update Status</label>
                <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={saving}>
                {saving ? 'Saving...' : 'Update Status'}
              </button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
