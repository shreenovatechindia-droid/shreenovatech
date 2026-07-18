import { useState, useEffect, useRef } from 'react';
import { getPayments, getPayment, updatePaymentStatus, deletePayment } from '../../utils/api';
import { toast } from './Toast';

const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const fmtCurrency = n => '₹' + Number(n || 0).toLocaleString('en-IN');

function StatusBadge({ status }) {
  const map = { pending:'yellow', verified:'green', rejected:'red' };
  return <span className={`adm-badge adm-badge-${map[status] || 'gray'}`}>{status}</span>;
}

export default function AdminPayments() {
  const [payments, setPayments]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('');
  const [pkg, setPkg]             = useState('');
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const debounce = useRef(null);

  async function load(p = 1) {
    setLoading(true);
    const params = new URLSearchParams({ page: p, limit: 20, ...(search && { search }), ...(status && { status }), ...(pkg && { package: pkg }) });
    try {
      const res = await getPayments(params.toString());
      if (res.data?.success) { setPayments(res.data.data.payments); setPagination(res.data.data.pagination); setPage(p); }
    } catch { toast('Load failed', 'error'); }
    setLoading(false);
  }

  useEffect(() => { load(1); }, [status, pkg]);
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(1), 400);
  }, [search]);

  async function openView(id) {
    const res = await getPayment(id);
    if (res.data?.success) setSelected(res.data.data);
  }

  async function handleStatus(s) {
    const res = await updatePaymentStatus(selected.id, s);
    if (res.data?.success) { toast(s === 'verified' ? 'Payment approved! ✅' : 'Payment rejected'); setSelected(null); load(page); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this payment?')) return;
    const res = await deletePayment(id);
    if (res.data?.success) { toast('Payment deleted'); load(page); }
    else toast(res.data?.message || 'Failed', 'error');
  }

  function exportCSV() {
    const rows = [['Ref ID','Name','Email','Package','Amount','Method','Status','Date'],
      ...payments.map(p => [p.ref_id, p.full_name, p.email, p.package_key, fmtCurrency(p.total_amount), p.pay_method||'', p.status, fmtDate(p.created_at)])];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'payments.csv'; a.click();
  }

  return (
    <div>
      <div className="adm-filter">
        <div className="adm-search">
          <span>🔍</span>
          <input placeholder="Search name, email, ref..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <select className="adm-select" value={pkg} onChange={e => setPkg(e.target.value)}>
          <option value="">All Packages</option>
          <option value="silver">Silver</option>
          <option value="golden">Golden</option>
          <option value="diamond">Diamond</option>
        </select>
        <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={exportCSV}>📥 Export CSV</button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">All Payments</span>
          {pagination && <span style={{ fontSize:'12px', color:'#64748b' }}>Total: {pagination.total}</span>}
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Ref ID</th><th>Customer</th><th>Package</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8"><div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div></td></tr>
              ) : payments.length ? payments.map(p => (
                <tr key={p.id}>
                  <td><code style={{ fontSize:'11px', background:'#f1f5f9', padding:'2px 6px', borderRadius:'4px' }}>{p.ref_id}</code></td>
                  <td><strong>{p.full_name}</strong><br /><small style={{ color:'#64748b' }}>{p.email}</small></td>
                  <td><span className="adm-badge adm-badge-blue">{p.package_key?.toUpperCase()}</span></td>
                  <td><strong>{fmtCurrency(p.total_amount)}</strong></td>
                  <td>{p.pay_method || '—'}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{fmtDate(p.created_at)}</td>
                  <td style={{ display:'flex', gap:'6px' }}>
                    <button className="adm-btn-icon" onClick={() => openView(p.id)}>👁️</button>
                    <button className="adm-btn-icon" onClick={() => handleDelete(p.id)} style={{ color:'#ef4444' }}>🗑️</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8"><div className="adm-empty"><div className="adm-empty-icon">💳</div><p>No payments found</p></div></td></tr>
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
          <div className="adm-modal adm-modal-lg">
            <div className="adm-modal-header">
              <span className="adm-modal-title">Payment — {selected.ref_id}</span>
              <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-detail-grid">
                {[['Name',selected.full_name],['Mobile',selected.mobile],['Email',selected.email],['Package',selected.package_name],['Amount',fmtCurrency(selected.amount)],['GST',fmtCurrency(selected.gst_amount)],['Total',fmtCurrency(selected.total_amount)],['Method',selected.pay_method||'—'],['Txn ID',selected.transaction_id||'—'],['Status',selected.status],['City',selected.city||'—'],['State',selected.state||'—']].map(([k,v]) => (
                  <div key={k} className="adm-detail-item">
                    <div className="adm-detail-label">{k}</div>
                    <div className="adm-detail-value">{v}</div>
                  </div>
                ))}
              </div>
              {selected.screenshot_url && (
                <div style={{ marginTop:'14px' }}>
                  <div className="adm-detail-label" style={{ marginBottom:'8px' }}>Payment Screenshot</div>
                  <img src={selected.screenshot_url} alt="screenshot" style={{ maxWidth:'100%', borderRadius:'8px', border:'1px solid #e2e8f0' }} />
                </div>
              )}
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={() => handleStatus('verified')}>✅ Approve</button>
              <button className="adm-btn adm-btn-danger"  onClick={() => handleStatus('rejected')}>❌ Reject</button>
              <button className="adm-btn adm-btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
