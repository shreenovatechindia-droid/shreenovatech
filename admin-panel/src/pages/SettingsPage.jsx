import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getSettings, updateSettings } from '../utils/api';

const TABS = [
  { key: 'website',  label: '🌐 Website',  icon: '🌐' },
  { key: 'company',  label: '🏢 Company',  icon: '🏢' },
  { key: 'smtp',     label: '📧 SMTP',     icon: '📧' },
  { key: 'whatsapp', label: '💬 WhatsApp', icon: '💬' },
  { key: 'social',   label: '📱 Social',   icon: '📱' },
  { key: 'analytics',label: '📊 Analytics',icon: '📊' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [activeTab, setActiveTab] = useState('website');
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
    try { await updateSettings(settings); showToast('Settings saved successfully!'); }
    catch { showToast('Save failed', 'error'); }
    setSaving(false);
  };

  const s   = (key) => settings[key] || '';
  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

  const Field = ({ label, k, type = 'text', placeholder = '', rows }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {rows ? (
        <textarea className="form-control" rows={rows} value={s(k)} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className="form-control" value={s(k)} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <AdminLayout title="Settings">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      {loading ? <div className="empty-state"><p>Loading...</p></div> : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`btn btn-sm ${activeTab === t.key ? 'btn-primary' : 'btn-outline'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">{TABS.find(t => t.key === activeTab)?.label} Settings</span>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
            </div>
            <div className="card-body">

              {activeTab === 'website' && (
                <div className="form-grid">
                  <Field label="Site Name" k="site_name" placeholder="ShreeNova Tech" />
                  <Field label="Site Tagline" k="site_tagline" placeholder="Premium Web Solutions" />
                  <Field label="Site URL" k="site_url" placeholder="https://shreenovatech.in" />
                  <Field label="Logo URL" k="logo_url" placeholder="https://..." />
                  <Field label="Favicon URL" k="favicon_url" placeholder="https://..." />
                  <Field label="Primary Color" k="primary_color" type="color" />
                  <Field label="Site Description" k="site_description" rows={3} placeholder="About your website..." />
                  <div className="form-group">
                    <label className="form-label">Maintenance Mode</label>
                    <select className="form-control" value={s('maintenance_mode')} onChange={e => set('maintenance_mode', e.target.value)}>
                      <option value="0">Off</option>
                      <option value="1">On</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="form-grid">
                  <Field label="Company Name" k="company_name" placeholder="ShreeNova Tech" />
                  <Field label="Company Email" k="company_email" placeholder="support@shreenovatech.in" />
                  <Field label="Company Phone" k="company_phone" placeholder="+91 98765 43210" />
                  <Field label="WhatsApp Number" k="company_whatsapp" placeholder="+91 98765 43210" />
                  <Field label="GST Number" k="company_gst" placeholder="GSTIN..." />
                  <Field label="PAN Number" k="company_pan" placeholder="PAN..." />
                  <Field label="Address" k="company_address" rows={3} placeholder="Full address..." />
                  <Field label="City" k="company_city" placeholder="Patna" />
                  <Field label="State" k="company_state" placeholder="Bihar" />
                  <Field label="Pincode" k="company_pincode" placeholder="800001" />
                  <Field label="Country" k="company_country" placeholder="India" />
                  <Field label="Working Hours" k="company_hours" placeholder="Mon-Sat: 9AM - 6PM" />
                </div>
              )}

              {activeTab === 'smtp' && (
                <div className="form-grid">
                  <div className="form-group form-full" style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 13, color: '#92400e' }}>⚠️ SMTP credentials are stored in <strong>.env</strong> file for security. Changes here are for reference only.</p>
                  </div>
                  <Field label="SMTP Host" k="smtp_host" placeholder="smtp.gmail.com" />
                  <Field label="SMTP Port" k="smtp_port" placeholder="587" />
                  <Field label="SMTP User (Email)" k="smtp_user" placeholder="support@shreenovatech.in" />
                  <Field label="From Name" k="smtp_from_name" placeholder="ShreeNova Tech" />
                  <Field label="Reply-To Email" k="smtp_reply_to" placeholder="noreply@shreenovatech.in" />
                  <div className="form-group">
                    <label className="form-label">Encryption</label>
                    <select className="form-control" value={s('smtp_encryption')} onChange={e => set('smtp_encryption', e.target.value)}>
                      <option value="tls">TLS (Port 587)</option>
                      <option value="ssl">SSL (Port 465)</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'whatsapp' && (
                <div className="form-grid">
                  <div className="form-group form-full" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 13, color: '#166534' }}>✅ WhatsApp API credentials are stored in <strong>.env</strong> file. Token & Phone ID are already configured.</p>
                  </div>
                  <Field label="Business Name" k="wa_business_name" placeholder="ShreeNova Tech" />
                  <Field label="WhatsApp Number" k="wa_number" placeholder="+91 98765 43210" />
                  <Field label="WhatsApp Link" k="wa_link" placeholder="https://wa.me/919876543210" />
                  <div className="form-group">
                    <label className="form-label">API Provider</label>
                    <select className="form-control" value={s('wa_provider')} onChange={e => set('wa_provider', e.target.value)}>
                      <option value="meta">Meta WhatsApp Cloud API</option>
                      <option value="twilio">Twilio (Future)</option>
                    </select>
                  </div>
                  <Field label="Approval Message Template" k="wa_approval_template" rows={4} placeholder="Custom approval message..." />
                  <Field label="Rejection Message Template" k="wa_rejection_template" rows={4} placeholder="Custom rejection message..." />
                </div>
              )}

              {activeTab === 'social' && (
                <div className="form-grid">
                  <Field label="Facebook URL" k="social_facebook" placeholder="https://facebook.com/shreenovatech" />
                  <Field label="Instagram URL" k="social_instagram" placeholder="https://instagram.com/shreenovatech" />
                  <Field label="Twitter/X URL" k="social_twitter" placeholder="https://twitter.com/shreenovatech" />
                  <Field label="LinkedIn URL" k="social_linkedin" placeholder="https://linkedin.com/company/shreenovatech" />
                  <Field label="YouTube URL" k="social_youtube" placeholder="https://youtube.com/@shreenovatech" />
                  <Field label="GitHub URL" k="social_github" placeholder="https://github.com/shreenovatech" />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="form-grid">
                  <Field label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
                  <Field label="Google Tag Manager ID" k="google_tag_manager" placeholder="GTM-XXXXXXX" />
                  <Field label="Facebook Pixel ID" k="facebook_pixel_id" placeholder="XXXXXXXXXXXXXXX" />
                  <Field label="Google Search Console" k="google_search_console" placeholder="Verification meta tag content" />
                  <Field label="Hotjar Site ID" k="hotjar_id" placeholder="XXXXXXX" />
                  <div className="form-group">
                    <label className="form-label">Cookie Consent</label>
                    <select className="form-control" value={s('cookie_consent')} onChange={e => set('cookie_consent', e.target.value)}>
                      <option value="1">Enabled</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
