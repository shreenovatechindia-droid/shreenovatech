import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../utils/api';
import './admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (localStorage.getItem('snt_token')) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email aur password required hai.'); return; }
    setLoading(true);
    try {
      const res = await adminLogin({ email, password });
      if (res.data?.success) {
        localStorage.setItem('snt_token', res.data.data.token);
        localStorage.setItem('snt_user',  JSON.stringify(res.data.data.user));
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.data?.message || 'Invalid credentials.');
      }
    } catch {
      setError('Server se connect nahi ho pa raha. XAMPP check karo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a,#1e293b)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'Segoe UI,system-ui,sans-serif' }}>
      <div style={{ background:'#fff', borderRadius:'18px', padding:'40px', width:'100%', maxWidth:'420px', boxShadow:'0 25px 60px rgba(0,0,0,.35)' }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <img src="/logo.png" alt="SNT" style={{ height:'44px', objectFit:'contain' }} onError={e => e.target.style.display='none'} />
          <h1 style={{ fontSize:'20px', fontWeight:'800', color:'#0f172a', marginTop:'10px' }}>ShreeNova Tech</h1>
          <p style={{ fontSize:'13px', color:'#64748b', marginTop:'4px' }}>Admin Panel — Secure Login</p>
        </div>

        {error && <div className="adm-alert adm-alert-error" style={{ marginBottom:'16px' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="adm-form-group" style={{ marginBottom:'14px' }}>
            <label className="adm-label">Email Address</label>
            <input className="adm-input" type="email" placeholder="admin@shreenovatech.in"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="adm-form-group" style={{ marginBottom:'20px' }}>
            <label className="adm-label">Password</label>
            <input className="adm-input" type="password" placeholder="Enter password"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:'14px' }}>
            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:'18px', fontSize:'12px', color:'#94a3b8' }}>
          &copy; {new Date().getFullYear()} ShreeNova Tech. All rights reserved.
        </div>
      </div>
    </div>
  );
}
