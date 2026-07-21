import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getPayments, getPayment,
  updatePaymentStatus, deletePayment,
  approvePayment, rejectPayment,
} from '../utils/api';
import { FiSearch, FiEye, FiTrash2, FiCheck, FiX, FiDownload, FiExternalLink } from 'react-icons/fi';

const STATUS_MAP = {
  pending:  { label: 'Pending',  cls: 'badge-yellow' },
  verified: { label: 'Verified', cls: 'badge-green'  },
  rejected: { label: 'Rejected', cls: 'badge-red'    },
  approved: { label: 'Approved', cls: 'badge-green'  },
};

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtCurrency(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

export default function PaymentsPage() {
  const [rows, setRows]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
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

  const openView = async (id) => {
    const r = await getPayment(id);
    setSelected(r.data.data);
    setNewStatus(r.data.data.status);
    setNotes(r.data.data.admin_notes || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await updatePaymentStatus(selected._id || selected.id, newStatus, notes);
      showToast('Payment status updated!');
      setModalOpen(false);
      load(page);
    } catch { showToast('Failed to update', 'error'); }
    setSaving(false);
  };

  const handleApprove = async () => {
    if (!window.confirm(`Approve payment for ${selected.full_name}?\n\nThis will automatically send Email & WhatsApp notification to the customer.`)) return;
    setActionLoading('approve');
    try {
      await approvePayment(selected._id || selected.id, notes);
      showToast('✅ Payment Approved! Email & WhatsApp sent to customer.');
      setModalOpen(false);
      load(page);
    } catch (e) {
      showToast(e?.response?.data?.message || 'Approval failed', 'error');
    }
    setActionLoading('');
  };

  const handleReject = async () => {
    if (!window.confirm(`Reject payment for ${selected.full_name}?\n\nThis will notify the customer via Email & WhatsApp.`)) return;
    setActionLoading('reject');
    try {
      await rejectPayment(selected._id || selected.id, notes);
      showToast('❌ Payment Rejected. Customer notified.');
      setModalOpen(false);
      load(page);
    } catch (e) {
      showToast(e?.response?.data?.message || 'Rejection failed', 'error');
    }
    setActionLoading('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    await deletePayment(id);
    showToast('Payment deleted');
    load(page);
  };

  const totalPages = Math.ceil(total / 20);
  const BASE_URL   = import.meta.env.VITE_BASE_URL || '';

  const screenshotUrl = selected?.screenshot_url
    ? (selected.screenshot_url.startsWith('http') ? selected.screenshot_url : `${BASE_URL}${selected.screenshot_url}`)
    : null;

  return (
    <AdminLayout title="Payments">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
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
          <option value="approved">Approved</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Payments</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {total}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ref ID</th><th>Customer</th><th>Package</th>
                <th>Amount</th><th>Method</th><th>Status</th>
                <th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><span className="empty-state-icon">💳</span><p>No payments found</p></div></td></tr>
              ) : rows.map(p => (
                <tr key={p._id || p.id}>
                  <td><code style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{p.ref_id}</code></td>
                  <td>
                    <strong>{p.full_name}</strong><br />
                    <small style={{ color: 'var(--muted)' }}>{p.email}</small>
                  </td>
                  <td>{p.package_name || '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--green)' }}>{fmtCurrency(p.total_amount)}</td>
                  <td>{p.pay_method || '—'}</td>
                  <td><span className={`badge ${STATUS_MAP[p.status]?.cls || 'badge-gray'}`}>{STATUS_MAP[p.status]?.label || p.status}</span></td>
                  <td>{fmtDate(p.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openView(p._id || p.id)} title="View Details"><FiEye size={14} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(p._id || p.id)} title="Delete"><FiTrash2 size={14} /></button>
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

      {/* ── Detail Modal ── */}
      {modalOpen && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg" style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <span className="modal-title">💳 Payment — {selected.ref_id}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

              {/* Status Badge */}
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${STATUS_MAP[selected.status]?.cls || 'badge-gray'}`} style={{ fontSize: 13, padding: '5px 14px' }}>
                  {STATUS_MAP[selected.status]?.label || selected.status}
                </span>
                {selected.payment_verified && (
                  <span className="badge badge-green" style={{ fontSize: 12 }}>✅ Payment Verified</span>
                )}
                {selected.approved_at && (
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>Approved: {fmtDate(selected.approved_at)}</span>
                )}
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  👤 Customer Details
                </div>
                <div className="detail-grid">
                  {[
                    ['Full Name',   selected.full_name],
                    ['Mobile',      selected.mobile],
                    ['WhatsApp',    selected.whatsapp || '—'],
                    ['Email',       selected.email],
                    ['Company',     selected.company || '—'],
                    ['GST No.',     selected.gst || '—'],
                    ['Address',     selected.address || '—'],
                    ['City',        selected.city || '—'],
                    ['State',       selected.state || '—'],
                    ['Pincode',     selected.pincode || '—'],
                  ].map(([k, v]) => (
                    <div className="detail-item" key={k}>
                      <div className="detail-key">{k}</div>
                      <div className="detail-val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  💰 Payment Details
                </div>
                <div className="detail-grid">
                  {[
                    ['Ref ID',         selected.ref_id],
                    ['Package',        selected.package_name || '—'],
                    ['Amount',         fmtCurrency(selected.amount)],
                    ['GST (18%)',      fmtCurrency(selected.gst_amount)],
                    ['Total Paid',     fmtCurrency(selected.total_amount)],
                    ['Pay Method',     selected.pay_method || '—'],
                    ['Transaction ID', selected.transaction_id || '—'],
                    ['Submitted On',   fmtDate(selected.created_at)],
                    ['Verified At',    selected.verified_at ? fmtDate(selected.verified_at) : '—'],
                    ['Approved At',    selected.approved_at ? fmtDate(selected.approved_at) : '—'],
                  ].map(([k, v]) => (
                    <div className="detail-item" key={k}>
                      <div className="detail-key">{k}</div>
                      <div className="detail-val">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshot */}
              {screenshotUrl && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                    🖼️ Payment Screenshot
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <a href={screenshotUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      <FiExternalLink size={13} /> View Screenshot
                    </a>
                    <a href={screenshotUrl} download className="btn btn-outline btn-sm">
                      <FiDownload size={13} /> Download Screenshot
                    </a>
                  </div>
                  <a href={screenshotUrl} target="_blank" rel="noreferrer">
                    <img
                      src={screenshotUrl}
                      alt="Payment Screenshot"
                      style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 10, border: '1px solid var(--border)', display: 'block' }}
                    />
                  </a>
                </div>
              )}

              {/* Admin Notes */}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Admin Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add notes before approving or rejecting..."
                />
              </div>

              {/* Manual Status Update */}
              <div style={{ marginBottom: 4 }}>
                <label className="form-label">Manual Status Update</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select className="form-control" style={{ flex: 1 }} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="btn btn-outline btn-sm" onClick={handleUpdateStatus} disabled={saving}>
                    {saving ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </div>

            </div>

            {/* Footer — Main Action Buttons */}
            <div className="modal-footer" style={{ gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={handleApprove}
                disabled={actionLoading !== '' || selected.status === 'approved'}
              >
                <FiCheck size={15} />
                {actionLoading === 'approve' ? 'Approving...' : 'Approve Payment'}
              </button>

              <button
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={handleReject}
                disabled={actionLoading !== ''}
              >
                <FiX size={15} />
                {actionLoading === 'reject' ? 'Rejecting...' : 'Reject Payment'}
              </button>

              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
