import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getDashboard } from '../utils/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  FiEye, FiCalendar, FiCreditCard, FiMessageSquare,
  FiCheckCircle, FiUsers, FiTrendingUp, FiDollarSign,
} from 'react-icons/fi';

function fmtCurrency(n) {
  if (!n) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}
function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

const STATUS_MAP = {
  new:         { label:'New',         cls:'badge-blue'   },
  contacted:   { label:'Contacted',   cls:'badge-yellow' },
  in_progress: { label:'In Progress', cls:'badge-orange' },
  completed:   { label:'Completed',   cls:'badge-green'  },
  cancelled:   { label:'Cancelled',   cls:'badge-red'    },
  pending:     { label:'Pending',     cls:'badge-yellow' },
  verified:    { label:'Verified',    cls:'badge-green'  },
  rejected:    { label:'Rejected',    cls:'badge-red'    },
  read:        { label:'Read',        cls:'badge-blue'   },
  replied:     { label:'Replied',     cls:'badge-green'  },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'badge-gray' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

const STATS_CONFIG = [
  { key:'total_visitors',   label:'Total Visitors',    icon:FiEye,          cls:'blue'   },
  { key:'today_visitors',   label:"Today's Visitors",  icon:FiUsers,        cls:'purple' },
  { key:'total_bookings',   label:'Total Bookings',    icon:FiCalendar,     cls:'green'  },
  { key:'pending_bookings', label:'Pending Bookings',  icon:FiTrendingUp,   cls:'yellow' },
  { key:'completed',        label:'Completed',         icon:FiCheckCircle,  cls:'green'  },
  { key:'total_contacts',   label:'Messages',          icon:FiMessageSquare,cls:'orange' },
  { key:'total_payments',   label:'Total Payments',    icon:FiCreditCard,   cls:'blue'   },
  { key:'total_revenue',    label:'Total Revenue',     icon:FiDollarSign,   cls:'green', fmt: fmtCurrency },
];

export default function DashboardPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = data?.counts || {};

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="empty-state"><p>Loading dashboard...</p></div>
      ) : (
        <>
          {/* Stats */}
          <div className="stats-grid">
            {STATS_CONFIG.map(s => {
              const Icon = s.icon;
              const val  = s.fmt ? s.fmt(counts[s.key]) : (counts[s.key] ?? 0);
              return (
                <div className="stat-card" key={s.key}>
                  <div className={`stat-icon ${s.cls}`}><Icon size={22} /></div>
                  <div>
                    <div className="stat-num">{val}</div>
                    <div className="stat-lbl">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="card">
              <div className="card-header"><span className="card-title">📈 Monthly Bookings</span></div>
              <div className="card-body">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.monthly_bookings || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize:11 }} />
                      <YAxis tick={{ fontSize:11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bookings"  fill="#22c55e" radius={[4,4,0,0]} name="Bookings" />
                      <Bar dataKey="completed" fill="#3b82f6" radius={[4,4,0,0]} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">💰 Monthly Revenue</span></div>
              <div className="card-body">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.monthly_revenue || []}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize:11 }} />
                      <YAxis tick={{ fontSize:11 }} />
                      <Tooltip formatter={v => fmtCurrency(v)} />
                      <Area type="monotone" dataKey="amount" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tables */}
          <div className="tables-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">📋 Recent Bookings</span>
                <a href="/bookings" className="btn btn-outline btn-sm">View All</a>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Project</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {(data?.recent_bookings || []).length === 0 ? (
                      <tr><td colSpan={4}><div className="empty-state"><p>No bookings yet</p></div></td></tr>
                    ) : (data?.recent_bookings || []).map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.full_name}</strong><br /><small style={{color:'var(--muted)'}}>{b.email}</small></td>
                        <td>{b.project_type || '—'}</td>
                        <td><StatusBadge status={b.status} /></td>
                        <td>{fmtDate(b.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">✉️ Recent Contacts</span>
                <a href="/contacts" className="btn btn-outline btn-sm">View All</a>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {(data?.recent_contacts || []).length === 0 ? (
                      <tr><td colSpan={4}><div className="empty-state"><p>No messages yet</p></div></td></tr>
                    ) : (data?.recent_contacts || []).map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.name}</strong></td>
                        <td style={{fontSize:12}}>{c.email}</td>
                        <td><StatusBadge status={c.status} /></td>
                        <td>{fmtDate(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">💳 Recent Payments</span>
                <a href="/payments" className="btn btn-outline btn-sm">View All</a>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Package</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {(data?.recent_payments || []).length === 0 ? (
                      <tr><td colSpan={4}><div className="empty-state"><p>No payments yet</p></div></td></tr>
                    ) : (data?.recent_payments || []).map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.full_name}</strong></td>
                        <td>{p.package_name || '—'}</td>
                        <td style={{fontWeight:700,color:'var(--green)'}}>{fmtCurrency(p.total_amount)}</td>
                        <td><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">🕐 Recent Activity</span></div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {(data?.activity || []).length === 0 ? (
                  <div className="empty-state"><p>No activity yet</p></div>
                ) : (data?.activity || []).map((a, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>
                        {a.admin_name || 'System'} <span style={{ fontWeight:400, color:'var(--muted)' }}>{a.action}</span> in {a.module}
                      </div>
                      <div style={{ fontSize:11, color:'var(--muted)' }}>{fmtDate(a.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
