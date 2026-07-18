import { useState, useEffect } from 'react';
import { getPricing, updatePricing } from '../../utils/api';
import { toast } from './Toast';

export default function AdminPricing() {
  const [plans, setPlans]   = useState([]);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getPricing();
      if (res.data?.success) setPlans(res.data.data);
    } catch { toast('Load failed', 'error'); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openEdit(p) {
    setForm({ ...p, features: (p.features || []).join('\n'), is_featured: !!p.is_featured, is_active: !!p.is_active });
    setEditId(p.id); setModal(true);
  }

  async function handleSave() {
    const payload = { ...form, features: form.features.split('\n').map(s => s.trim()).filter(Boolean), is_featured: form.is_featured ? 1 : 0, is_active: form.is_active ? 1 : 0 };
    try {
      const res = await updatePricing(editId, payload);
      if (res.data?.success) { toast('Plan updated!'); setModal(false); load(); }
      else toast(res.data?.message || 'Failed', 'error');
    } catch { toast('Error', 'error'); }
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const badgeColor = { SILVER:'#94a3b8', GOLDEN:'#f59e0b', DIAMOND:'#6366f1' };

  if (loading) return <div className="adm-empty"><div className="adm-empty-icon">⏳</div><p>Loading...</p></div>;

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'18px' }}>
        {plans.map(p => (
          <div key={p.id} className="adm-card">
            <div className="adm-card-header">
              <span className="adm-card-title" style={{ color: badgeColor[p.badge] || '#0f172a' }}>{p.badge} — {p.name}</span>
              <div style={{ display:'flex', gap:'6px' }}>
                {p.is_featured ? <span className="adm-badge adm-badge-yellow">⭐ Featured</span> : null}
                {p.is_active ? <span className="adm-badge adm-badge-green">Active</span> : <span className="adm-badge adm-badge-gray">Inactive</span>}
              </div>
            </div>
            <div className="adm-card-body">
              <div style={{ fontSize:'28px', fontWeight:'900', color:'#f97316', marginBottom:'6px' }}>{p.price}</div>
              <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'10px' }}>{p.renewal}</div>
              <div style={{ fontSize:'13px', color:'#374151', marginBottom:'14px' }}>{p.description}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'5px', marginBottom:'18px' }}>
                {(p.features || []).map((feat, i) => (
                  <li key={i} style={{ fontSize:'12.5px', display:'flex', alignItems:'center', gap:'7px' }}>
                    <span style={{ color:'#22c55e', fontWeight:'700' }}>✓</span>{feat}
                  </li>
                ))}
              </ul>
              <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => openEdit(p)}>✏️ Edit Plan</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="adm-modal-bg" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="adm-modal adm-modal-lg">
            <div className="adm-modal-header">
              <span className="adm-modal-title">Edit {form.name}</span>
              <button className="adm-modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Plan Name</label><input className="adm-input" value={form.name || ''} onChange={e => f('name', e.target.value)} /></div>
                <div className="adm-form-group"><label className="adm-label">Price Display</label><input className="adm-input" placeholder="₹9,999" value={form.price || ''} onChange={e => f('price', e.target.value)} /></div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Price (Number)</label><input className="adm-input" type="number" value={form.price_num || ''} onChange={e => f('price_num', parseInt(e.target.value) || 0)} /></div>
                <div className="adm-form-group"><label className="adm-label">Renewal Text</label><input className="adm-input" value={form.renewal || ''} onChange={e => f('renewal', e.target.value)} /></div>
              </div>
              <div className="adm-form-row full">
                <div className="adm-form-group"><label className="adm-label">Description</label><textarea className="adm-input" rows="2" value={form.description || ''} onChange={e => f('description', e.target.value)} /></div>
              </div>
              <div className="adm-form-row full">
                <div className="adm-form-group"><label className="adm-label">Features (ek line mein ek feature)</label><textarea className="adm-input" rows="10" value={form.features || ''} onChange={e => f('features', e.target.value)} /></div>
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group"><label className="adm-label">Sort Order</label><input className="adm-input" type="number" value={form.sort_order || 0} onChange={e => f('sort_order', parseInt(e.target.value) || 0)} /></div>
                <div className="adm-form-group" style={{ flexDirection:'row', alignItems:'flex-end', gap:'20px', paddingBottom:'4px' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                    <input type="checkbox" checked={!!form.is_featured} onChange={e => f('is_featured', e.target.checked)} /> Featured
                  </label>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
                    <input type="checkbox" checked={!!form.is_active} onChange={e => f('is_active', e.target.checked)} /> Active
                  </label>
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-primary" onClick={handleSave}>💾 Save Plan</button>
              <button className="adm-btn adm-btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
