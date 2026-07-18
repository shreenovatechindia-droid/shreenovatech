import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../utils/api';
import { toast } from './Toast';

const TABS = [
  { key:'general', label:'🏢 General' },
  { key:'payment', label:'💳 Payment' },
  { key:'social',  label:'📱 Social' },
  { key:'smtp',    label:'📧 SMTP' },
  { key:'seo',     label:'🔍 SEO' },
  { key:'hero',    label:'🦸 Hero' },
];

const FIELDS = {
  general: ['company_name','company_email','company_phone','company_whatsapp','company_address','company_website','logo_url','topbar_text'],
  payment: ['bank_holder','bank_name','bank_account','bank_ifsc','bank_branch','upi_id','qr_code_url'],
  social:  ['facebook_url','instagram_url','youtube_url','linkedin_url'],
  smtp:    ['smtp_host','smtp_port','smtp_user','smtp_pass','smtp_from_name'],
  seo:     ['meta_title','meta_description','meta_keywords','google_analytics'],
  hero:    ['hero_title','hero_price','hero_slots','hero_offer_text'],
};

const LABELS = {
  company_name:'Company Name', company_email:'Email', company_phone:'Phone', company_whatsapp:'WhatsApp Number',
  company_address:'Address', company_website:'Website', logo_url:'Logo URL', topbar_text:'Topbar Announcement Text',
  bank_holder:'Account Holder', bank_name:'Bank Name', bank_account:'Account Number', bank_ifsc:'IFSC Code',
  bank_branch:'Branch Name', upi_id:'UPI ID', qr_code_url:'QR Code URL',
  facebook_url:'Facebook URL', instagram_url:'Instagram URL', youtube_url:'YouTube URL', linkedin_url:'LinkedIn URL',
  smtp_host:'SMTP Host', smtp_port:'SMTP Port', smtp_user:'SMTP Username', smtp_pass:'SMTP Password', smtp_from_name:'From Name',
  meta_title:'Meta Title', meta_description:'Meta Description', meta_keywords:'Meta Keywords', google_analytics:'Google Analytics ID',
  hero_title:'Hero Title', hero_price:'Hero Price', hero_slots:'Slots Text', hero_offer_text:'Offer Text',
};

const TEXTAREA_FIELDS = ['company_address','topbar_text','meta_description'];
const PASSWORD_FIELDS = ['smtp_pass'];

export default function AdminSettings() {
  const [tab, setTab]       = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getSettings().then(res => {
      if (res.data?.success) setSettings(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    const keys = FIELDS[tab];
    const payload = {};
    keys.forEach(k => { payload[k] = settings[k] || ''; });
    try {
      const res = await updateSettings(payload);
      if (res.data?.success) toast('Settings saved! ✅');
      else toast(res.data?.message || 'Failed', 'error');
    } catch { toast('Error', 'error'); }
  }

  const set = (k, v) => setSettings(prev => ({ ...prev, [k]: v }));

  if (loading) return <div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div>;

  return (
    <div>
      <div className="adm-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`adm-btn adm-btn-sm ${tab === t.key ? 'adm-btn-primary' : 'adm-btn-outline'}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">{TABS.find(t => t.key === tab)?.label} Settings</span>
        </div>
        <div className="adm-card-body">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'18px' }}>
            {FIELDS[tab].map(k => (
              <div key={k} className="adm-form-group" style={{ gridColumn: TEXTAREA_FIELDS.includes(k) ? 'span 2' : 'span 1' }}>
                <label className="adm-label">{LABELS[k] || k}</label>
                {TEXTAREA_FIELDS.includes(k)
                  ? <textarea className="adm-input" rows="3" value={settings[k] || ''} onChange={e => set(k, e.target.value)} />
                  : <input className="adm-input" type={PASSWORD_FIELDS.includes(k) ? 'password' : 'text'} value={settings[k] || ''} onChange={e => set(k, e.target.value)} />
                }
              </div>
            ))}
          </div>
          <button className="adm-btn adm-btn-primary" onClick={handleSave}>💾 Save {TABS.find(t => t.key === tab)?.label} Settings</button>
        </div>
      </div>
    </div>
  );
}
