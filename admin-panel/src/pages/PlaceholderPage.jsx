import AdminLayout from '../components/AdminLayout';

export default function PlaceholderPage({ title, icon = '🚧' }) {
  return (
    <AdminLayout title={title}>
      <div className="card">
        <div className="card-body">
          <div className="empty-state" style={{ padding: '80px 24px' }}>
            <span className="empty-state-icon">{icon}</span>
            <p style={{ fontSize:16, fontWeight:700 }}>{title}</p>
            <p style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>
              This section is managed via the existing HTML admin panel.
            </p>
            <a
              href={`/shreenovatech/backend/admin/${title.toLowerCase().replace(/\s+/g, '')}.html`}
              className="btn btn-primary"
              style={{ marginTop:16 }}
              target="_blank"
              rel="noreferrer"
            >
              Open in HTML Admin →
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
