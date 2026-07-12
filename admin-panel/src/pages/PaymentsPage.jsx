import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getPayments, getPayment, updatePaymentStatus, deletePayment } from '../utils/api';
import { FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';

const STATUS_MAP = {
  pending:  { label:'Pending',  cls:'badge-yellow' },
  verified: { label:'Verified', cls:'badge-green'  },
  rejected: { label:'Rejected', cls:'badge-red'    },
};

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtCurrency(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

export default function PaymentsPage() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes]     = useState('');
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
      const r = await getPayments(params.toString());
      setRows(r.data.data.payments || []);
      setTotal(r.data.data.pagination?.total || 0);
      setPage(p);
    } catch {}
    setLoading(false);
  }, [search, status]);

  useEffect(() => { load(1); }, [status]);

  const openView = async id => {
    const r = await getPayment(id);
    setSelected(r.data.data);
    setNewStatus(r.data.data.status);
    setNotes(r.data.data.admin_notes || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await updatePaymentStatus(selected.id, newStatus, notes);
      showToast('Payment status updated!');
      setModalOpen(false);
      load(page);
    } catch { showToast('Failed to update', 'error'); }
    setSaving(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this payment?')) return;
    await deletePayment(id);
    showToast('Payment deleted');
    load(page);
  };

  const totalPages = Math.ceil(total / 20);
  const BASE_URL = import.meta.env.VITE_BASE_URL || '';

  return (
    <AdminLayout title="Payments">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color:'var(--muted)', flexShrink:0 }} />
          <input
            placeholder="Search by name, email, ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(1)}
          />
        </div>
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Payments</span>
          <span style={{ fontSize:13, color:'var(--muted)' }}>Total: {total}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ref ID</th><th>Customer</th><th>Package</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><span className="empty-state-icon">💳</span><p>No payments found</p></div></td></tr>
              ) : rows.map(p => (
                <tr key={p.id}>
                  <td><code style={{ fontSize:11, background:'var(--bg)', padding:'2px 6px', borderRadius:4 }}>{p.ref_id}</code></td>
                  <td>
                    <strong>{p.full_name}</strong><br />
                    <small style={{ color:'var(--muted)' }}>{p.email}</small>
                  </td>
                  <td>{p.package_name || '—'}</td>
                  <td style={{ fontWeight:700, color:'var(--green)' }}>{fmtCurrency(p.total_amount)}</td>
                  <td>{p.pay_method || '—'}</td>
                  <td><span className={`badge ${STATUS_MAP[p.status]?.cls || 'badge-gray'}`}>{STATUS_MAP[p.status]?.label || p.status}</span></td>
                  <td>{fmtDate(p.created_at)}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn-icon" onClick={() => openView(p.id)} title="View"><FiEye size={14} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(p.id)} title="Delete"><FiTrash2 size={14} /></button>
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
              <span className="modal-title">Payment — {selected.ref_id}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                {[
                  ['Ref ID', selected.ref_id], ['Full Name', selected.full_name],
                  ['Mobile', selected.mobile], ['Email', selected.email],
                  ['Package', selected.package_name || '—'], ['Amount', fmtCurrency(selected.amount)],
                  ['GST (18%)', fmtCurrency(selected.gst_amount)], ['Total', fmtCurrency(selected.total_amount)],
                  ['Pay Method', selected.pay_method || '—'], ['Transaction ID', selected.transaction_id || '—'],
                  ['Status', selected.status], ['Date', fmtDate(selected.created_at)],
                ].map(([k, v]) => (
                  <div className="detail-item" key={k}>
                    <div className="detail-key">{k}</div>
                    <div className="detail-val">{v}</div>
                  </div>
                ))}
              </div>

              {selected.screenshot_url && (
                <div style={{ marginTop:16 }}>
                  <div className="detail-key" style={{ marginBottom:8 }}>Payment Screenshot</div>
                  <a href={`${BASE_URL}${selected.screenshot_url}`} target="_blank" rel="noreferrer">
                    <img
                      src={`${BASE_URL}${selected.screenshot_url}`}
                      alt="Screenshot"
                      style={{ maxWidth:'100%', maxHeight:300, borderRadius:10, border:'1px solid var(--border)' }}
                    />
                  </a>
                </div>
              )}

              <div style={{ marginTop:20 }}>
                <label className="form-label">Update Status</label>
                <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop:12 }}>
                <label className="form-label">Admin Notes</label>
                <textarea className="form-control" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
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
