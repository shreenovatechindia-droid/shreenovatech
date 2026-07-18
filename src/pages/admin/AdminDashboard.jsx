import { useState, useEffect, useRef } from 'react';
import { getDashboard } from '../../utils/api';

const fmtCurrency = n => '₹' + Number(n || 0).toLocaleString('en-IN');
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';

function StatusBadge({ status }) {
  const map = { new:'blue', pending:'yellow', contacted:'blue', in_progress:'purple', completed:'green', cancelled:'red', verified:'green', rejected:'red', read:'gray', replied:'green' };
  return <span className={`adm-badge adm-badge-${map[status] || 'gray'}`}>{status?.replace(/_/g, ' ')}</span>;
}

export default function AdminDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chart1    = useRef(null);
  const chart2    = useRef(null);

  useEffect(() => {
    getDashboard().then(res => {
      if (res.data?.success) setData(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data || !window.Chart) return;
    const c = data.counts;
    const months   = data.monthly_bookings.map(r => r.month);
    const bookings = data.monthly_bookings.map(r => r.bookings);
    const revAmts  = data.monthly_revenue.map(r => parseFloat(r.amount));

    if (chart1.current) chart1.current.destroy();
    if (chart2.current) chart2.current.destroy();

    chart1.current = new window.Chart(chartRef1.current, {
      type: 'bar',
      data: { labels: months, datasets: [{ label: 'Bookings', data: bookings, backgroundColor: 'rgba(34,197,94,.7)', borderRadius: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });
    chart2.current = new window.Chart(chartRef2.current, {
      type: 'line',
      data: { labels: data.monthly_revenue.map(r => r.month), datasets: [{ label: 'Revenue (₹)', data: revAmts, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.1)', fill: true, tension: .4, pointBackgroundColor: '#22c55e' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });
  }, [data]);

  if (loading) return <div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div>;
  if (!data)   return <div className="adm-empty"><div className="adm-empty-icon">❌</div><p>Data load nahi hua. XAMPP check karo.</p></div>;

  const c = data.counts;
  const stats = [
    { label: 'Total Visitors',    val: c.total_visitors,   icon: '👁️',  cls: 'blue'   },
    { label: "Today's Visitors",  val: c.today_visitors,   icon: '📍',  cls: 'teal'   },
    { label: 'Total Bookings',    val: c.total_bookings,   icon: '📋',  cls: 'green'  },
    { label: 'Pending Bookings',  val: c.pending_bookings, icon: '⏳',  cls: 'yellow' },
    { label: 'Completed',         val: c.completed,        icon: '✅',  cls: 'green'  },
    { label: 'Contact Messages',  val: c.total_contacts,   icon: '✉️',  cls: 'purple' },
    { label: 'Total Payments',    val: c.total_payments,   icon: '💳',  cls: 'orange' },
    { label: 'Total Revenue',     val: fmtCurrency(c.total_revenue), icon: '💰', cls: 'green' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="adm-stats">
        {stats.map(s => (
          <div key={s.label} className="adm-stat">
            <div className={`adm-stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="adm-stat-num">{s.val}</div><div className="adm-stat-lbl">{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="adm-charts">
        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">📈 Monthly Bookings</span></div>
          <div className="adm-card-body"><div className="adm-chart-wrap"><canvas ref={chartRef1}></canvas></div></div>
        </div>
        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">💰 Monthly Revenue</span></div>
          <div className="adm-card-body"><div className="adm-chart-wrap"><canvas ref={chartRef2}></canvas></div></div>
        </div>
      </div>

      {/* Recent Tables */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">📋 Recent Bookings</span></div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Name</th><th>Project</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.recent_bookings.length ? data.recent_bookings.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.full_name}</strong><br /><small style={{ color:'#64748b' }}>{b.email}</small></td>
                    <td>{b.project_type || '—'}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>{fmtDate(b.created_at)}</td>
                  </tr>
                )) : <tr><td colSpan="4"><div className="adm-empty"><p>No bookings yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">✉️ Recent Contacts</span></div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.recent_contacts.length ? data.recent_contacts.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ fontSize:'12px' }}>{c.email}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>{fmtDate(c.created_at)}</td>
                  </tr>
                )) : <tr><td colSpan="4"><div className="adm-empty"><p>No messages yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
