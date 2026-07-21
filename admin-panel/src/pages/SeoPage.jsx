import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getSettings, updateSettings } from '../utils/api';

const SEO_PAGES = [
  { key: 'home',            label: 'Home Page' },
  { key: 'about',           label: 'About Page' },
  { key: 'services',        label: 'Services Page' },
  { key: 'portfolio',       label: 'Portfolio Page' },
  { key: 'pricing',         label: 'Pricing Page' },
  { key: 'contact',         label: 'Contact Page' },
  { key: 'blog',            label: 'Blog Page' },
];

export default function SeoPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    getSettings()
      .then(r => setSettings(r.data.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast('SEO settings saved!');
    } catch { showToast('Save failed', 'error'); }
    setSaving(false);
  };

  const s = (key) => settings[key] || '';
  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

  const tab = activeTab;

  return (
    <AdminLayout title="SEO Settings">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : (
        <>
          {/* Page Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {SEO_PAGES.map(p => (
              <button key={p.key} onClick={() => setActiveTab(p.key)}
                className={`btn btn-sm ${activeTab === p.key ? 'btn-primary' : 'btn-outline'}`}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">🔍 SEO — {SEO_PAGES.find(p => p.key === tab)?.label}</span>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gap: 20 }}>

                {/* Basic Meta */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>📋 Basic Meta Tags</div>
                  <div className="form-grid">
                    <div className="form-group form-full">
                      <label className="form-label">Meta Title</label>
                      <input className="form-control" value={s(`seo_${tab}_title`)} onChange={e => set(`seo_${tab}_title`, e.target.value)} placeholder="Page title for search engines (50-60 chars)" />
                      <small style={{ color: 'var(--muted)', fontSize: 11 }}>{s(`seo_${tab}_title`).length}/60 characters</small>
                    </div>
                    <div className="form-group form-full">
                      <label className="form-label">Meta Description</label>
                      <textarea className="form-control" rows={3} value={s(`seo_${tab}_desc`)} onChange={e => set(`seo_${tab}_desc`, e.target.value)} placeholder="Page description for search engines (150-160 chars)" />
                      <small style={{ color: 'var(--muted)', fontSize: 11 }}>{s(`seo_${tab}_desc`).length}/160 characters</small>
                    </div>
                    <div className="form-group form-full">
                      <label className="form-label">Keywords</label>
                      <input className="form-control" value={s(`seo_${tab}_keywords`)} onChange={e => set(`seo_${tab}_keywords`, e.target.value)} placeholder="keyword1, keyword2, keyword3" />
                    </div>
                  </div>
                </div>

                {/* Open Graph */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>📘 Open Graph (Facebook/LinkedIn)</div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">OG Title</label><input className="form-control" value={s(`seo_${tab}_og_title`)} onChange={e => set(`seo_${tab}_og_title`, e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">OG Image URL</label><input className="form-control" value={s(`seo_${tab}_og_image`)} onChange={e => set(`seo_${tab}_og_image`, e.target.value)} placeholder="https://..." /></div>
                    <div className="form-group form-full"><label className="form-label">OG Description</label><textarea className="form-control" rows={2} value={s(`seo_${tab}_og_desc`)} onChange={e => set(`seo_${tab}_og_desc`, e.target.value)} /></div>
                  </div>
                </div>

                {/* Twitter Card */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>🐦 Twitter Card</div>
                  <div className="form-grid">
                    <div className="form-group"><label className="form-label">Twitter Title</label><input className="form-control" value={s(`seo_${tab}_tw_title`)} onChange={e => set(`seo_${tab}_tw_title`, e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Twitter Image URL</label><input className="form-control" value={s(`seo_${tab}_tw_image`)} onChange={e => set(`seo_${tab}_tw_image`, e.target.value)} /></div>
                    <div className="form-group form-full"><label className="form-label">Twitter Description</label><textarea className="form-control" rows={2} value={s(`seo_${tab}_tw_desc`)} onChange={e => set(`seo_${tab}_tw_desc`, e.target.value)} /></div>
                  </div>
                </div>

                {/* Global SEO */}
                {tab === 'home' && (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>⚙️ Global SEO Settings</div>
                    <div className="form-grid">
                      <div className="form-group"><label className="form-label">Robots.txt</label>
                        <select className="form-control" value={s('seo_robots')} onChange={e => set('seo_robots', e.target.value)}>
                          <option value="index,follow">index, follow</option>
                          <option value="noindex,nofollow">noindex, nofollow</option>
                          <option value="index,nofollow">index, nofollow</option>
                        </select>
                      </div>
                      <div className="form-group"><label className="form-label">Google Analytics ID</label><input className="form-control" value={s('google_analytics_id')} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
                      <div className="form-group"><label className="form-label">Google Search Console</label><input className="form-control" value={s('google_search_console')} onChange={e => set('google_search_console', e.target.value)} placeholder="Verification code" /></div>
                      <div className="form-group"><label className="form-label">Canonical URL</label><input className="form-control" value={s('canonical_url')} onChange={e => set('canonical_url', e.target.value)} placeholder="https://shreenovatech.in" /></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
