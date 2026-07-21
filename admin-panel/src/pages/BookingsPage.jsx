import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getBookings, getBooking, updateBookingStatus, deleteBooking } from '../utils/api';
import { FiSearch, FiRefreshCw, FiEye, FiTrash2, FiCheck, FiX, FiDownload, FiMail, FiMessageSquare, FiPrinter } from 'react-icons/fi';

const STATUS_OPTIONS = ['new','contacted','in_progress','completed','cancelled'];
const STATUS_MAP = {
  new:         { label:'New',         cls:'badge-blue'   },
  contacted:   { label:'Contacted',   cls:'badge-yellow' },
  in_progress: { label:'In Progress', cls:'badge-orange' },
  completed:   { label:'Completed',   cls:'badge-green'  },
  cancelled:   { label:'Cancelled',   cls:'badge-red'    },
};

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

function generateInvoiceHTML(b) {
  return `<!DOCTYPE html><html><head><title>Invoice - ${b.ref_id}</title>
  <style>body{font-family:Arial,sans-serif;padding:40px;color:#1e293b}h1{color:#16a34a}.header{display:flex;justify-content:space-between;margin-bottom:30px}.table{width:100%;border-collapse:collapse}th,td{padding:12px;border:1px solid #e2e8f0;text-align:left}th{background:#f8fafc}.total{font-size:18px;font-weight:700;color:#16a34a}</style>
  </head><body>
  <div class="header"><div><h1>ShreeNova Tech</h1><p>shreenovatech.in</p></div><div><h2>BOOKING INVOICE</h2><p>Ref: ${b.ref_id}</p><p>Date: ${fmtDate(b.created_at)}</p></div></div>
  <h3>Customer Details</h3>
  <table class="table"><tr><th>Name</th><td>${b.full_name}</td><th>Email</th><td>${b.email}</td></tr>
  <tr><th>Mobile</th><td>${b.mobile}</td><th>Company</th><td>${b.company||'—'}</td></tr>
  <tr><th>City</th><td>${b.city||'—'}</td><th>Country</th><td>${b.country||'India'}</td></tr></table>
  <h3 style="margin-top:20px">Project Details</h3>
  <table class="table"><tr><th>Project Type</th><td>${b.project_type||'—'}</td><th>Budget</th><td>${b.budget||'—'}</td></tr>
  <tr><th>Timeline</th><td>${b.timeline||'—'}</td><th>Status</th><td>${b.status}</td></tr></table>
  ${b.description ? `<h3 style="margin-top:20px">Description</h3><p>${b.description}</p>` : ''}
  <div style="margin-top:40px;text-align:center;color:#64748b;font-size:12px"><p>Thank you for choosing ShreeNova Tech ❤️</p><p>support@shreenovatech.in | shreenovatech.in</p></div>
  </body></html>`;
}

export default function BookingsPage() {
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

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

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

  const openView = async (id) => {
    try {
      const r = await getBooking(id);
      setSelected(r.data.data);
      setNewStatus(r.data.data.status);
      setNotes(r.data.data.admin_notes || '');
      setModalOpen(true);
    } catch { showToast('Failed to load booking', 'error'); }
  };

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await updateBookingStatus(selected._id || selected.id, newStatus, notes);
      showToast('Status updated!');
      setModalOpen(false); load(page);
    } catch { showToast('Failed to update', 'error'); }
    setSaving(false);
  };

  const quickStatus = async (id, st) => {
    setActionLoading(id + st);
    try {
      await updateBookingStatus(id, st);
      showToast(`Booking marked as ${st}!`);
      load(page);
    } catch { showToast('Update failed', 'error'); }
    setActionLoading('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try { await deleteBooking(id); showToast('Booking deleted'); load(page); }
    catch { showToast('Delete failed', 'error'); }
  };

  const handleDownloadInvoice = (b) => {
    const html = generateInvoiceHTML(b);
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `Invoice-${b.ref_id}.html`; a.click();
    URL.revokeObjectURL(url);
    showToast('Invoice downloaded!');
  };

  const handlePrint = (b) => {
    const html = generateInvoiceHTML(b);
    const win  = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const handleSendEmail = (b) => {
    const subject = encodeURIComponent(`Booking Confirmation - ${b.ref_id}`);
    const body    = encodeURIComponent(`Hello ${b.full_name},\n\nThank you for your booking.\n\nBooking ID: ${b.ref_id}\nProject: ${b.project_type || '—'}\nStatus: ${b.status}\n\nOur team will contact you shortly.\n\nRegards,\nShreeNova Tech`);
    window.open(`mailto:${b.email}?subject=${subject}&body=${body}`);
  };

  const handleSendWhatsApp = (b) => {
    const msg = encodeURIComponent(`Hello ${b.full_name} 👋\n\nYour booking has been received!\n\nBooking ID: ${b.ref_id}\nProject: ${b.project_type || '—'}\nStatus: ${b.status}\n\nOur team will contact you within 30 minutes.\n\nThank you for choosing ShreeNova Tech ❤️\nhttps://shreenovatech.in`);
    const num = (b.whatsapp || b.mobile || '').replace(/\D/g, '');
    window.open(`https://wa.me/91${num}?text=${msg}`, '_blank');
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <AdminLayout title="Bookings">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input placeholder="Search by name, email, mobile, ref..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(1)} />
        </div>
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => load(1)}><FiRefreshCw size={13} /> Refresh</button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📋 All Bookings</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {total}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ref ID</th><th>Customer</th><th>Project</th><th>Budget</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><span className="empty-state-icon">📋</span><p>No bookings found</p></div></td></tr>
              ) : rows.map(b => (
                <tr key={b._id || b.id}>
                  <td><code style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{b.ref_id}</code></td>
                  <td>
                    <strong>{b.full_name}</strong><br />
                    <small style={{ color: 'var(--muted)' }}>{b.email} · {b.mobile}</small>
                  </td>
                  <td>{b.project_type || '—'}</td>
                  <td>{b.budget || '—'}</td>
                  <td><span className={`badge ${STATUS_MAP[b.status]?.cls || 'badge-gray'}`}>{STATUS_MAP[b.status]?.label || b.status}</span></td>
                  <td style={{ fontSize: 12 }}>{fmtDate(b.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <button className="btn-icon" onClick={() => openView(b._id || b.id)} title="View Details"><FiEye size={13} /></button>
                      <button className="btn-icon" onClick={() => handleSendEmail(b)} title="Send Email"><FiMail size={13} /></button>
                      <button className="btn-icon" onClick={() => handleSendWhatsApp(b)} title="Send WhatsApp" style={{ color: '#25d366' }}><FiMessageSquare size={13} /></button>
                      <button className="btn-icon" onClick={() => handleDownloadInvoice(b)} title="Download Invoice"><FiDownload size={13} /></button>
                      <button className="btn-icon" onClick={() => handlePrint(b)} title="Print"><FiPrinter size={13} /></button>
                      {b.status !== 'completed' && <button className="btn-icon" onClick={() => quickStatus(b._id || b.id, 'completed')} title="Mark Completed" style={{ color: 'var(--green)' }} disabled={actionLoading === (b._id || b.id) + 'completed'}><FiCheck size={13} /></button>}
                      {b.status !== 'cancelled' && <button className="btn-icon danger" onClick={() => quickStatus(b._id || b.id, 'cancelled')} title="Cancel" disabled={actionLoading === (b._id || b.id) + 'cancelled'}><FiX size={13} /></button>}
                      <button className="btn-icon danger" onClick={() => handleDelete(b._id || b.id)} title="Delete"><FiTrash2 size={13} /></button>
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

      {/* Detail Modal */}
      {modalOpen && selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal modal-lg" style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <span className="modal-title">📋 Booking — {selected.ref_id}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, padding: '12px 16px', background: 'var(--bg)', borderRadius: 10 }}>
                <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none' }} onClick={() => { quickStatus(selected._id, 'completed'); setModalOpen(false); }}><FiCheck size={12} /> Mark Completed</button>
                <button className="btn btn-sm btn-danger" onClick={() => { quickStatus(selected._id, 'cancelled'); setModalOpen(false); }}><FiX size={12} /> Cancel</button>
                <button className="btn btn-sm btn-outline" onClick={() => handleSendEmail(selected)}><FiMail size={12} /> Send Email</button>
                <button className="btn btn-sm btn-outline" onClick={() => handleSendWhatsApp(selected)}><FiMessageSquare size={12} /> WhatsApp</button>
                <button className="btn btn-sm btn-outline" onClick={() => handleDownloadInvoice(selected)}><FiDownload size={12} /> Invoice</button>
                <button className="btn btn-sm btn-outline" onClick={() => handlePrint(selected)}><FiPrinter size={12} /> Print</button>
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>👤 Customer Details</div>
                <div className="detail-grid">
                  {[['Ref ID', selected.ref_id], ['Full Name', selected.full_name], ['Mobile', selected.mobile], ['WhatsApp', selected.whatsapp || '—'], ['Email', selected.email], ['Company', selected.company || '—'], ['City', selected.city || '—'], ['Country', selected.country || 'India']].map(([k, v]) => (
                    <div className="detail-item" key={k}><div className="detail-key">{k}</div><div className="detail-val">{v}</div></div>
                  ))}
                </div>
              </div>

              {/* Booking Details */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>📁 Booking Details</div>
                <div className="detail-grid">
                  {[['Project Type', selected.project_type || '—'], ['Budget', selected.budget || '—'], ['Timeline', selected.timeline || '—'], ['Status', selected.status], ['Date', fmtDate(selected.created_at)]].map(([k, v]) => (
                    <div className="detail-item" key={k}><div className="detail-key">{k}</div><div className="detail-val">{v}</div></div>
                  ))}
                </div>
              </div>

              {selected.description && (
                <div style={{ marginBottom: 16, background: 'var(--bg)', borderRadius: 10, padding: '14px 16px' }}>
                  <div className="detail-key" style={{ marginBottom: 8 }}>Description</div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>{selected.description}</p>
                </div>
              )}

              {selected.services?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div className="detail-key" style={{ marginBottom: 8 }}>Services</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selected.services.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <label className="form-label">Update Status</label>
                <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_MAP[s]?.label || s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Admin Notes</label>
                <textarea className="form-control" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={saving}>{saving ? 'Saving...' : 'Update Status'}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
