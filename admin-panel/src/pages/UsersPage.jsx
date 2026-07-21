import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const ROLES = ['super_admin','admin','editor','support'];
const ROLE_MAP = { super_admin:'Super Admin', admin:'Admin', editor:'Editor', support:'Support' };
const ROLE_CLS = { super_admin:'badge-red', admin:'badge-blue', editor:'badge-green', support:'badge-yellow' };
const EMPTY = { username:'', email:'', full_name:'', role:'admin', password:'', is_active:true };

function fmtDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function UsersPage() {
  const { user: me } = useAuth();
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await getUsers(); setRows(r.data.data || []); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = search ? rows.filter(r => r.full_name?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase()) || r.username?.toLowerCase().includes(search.toLowerCase())) : rows;

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r, password: '' }); setModalOpen(true); };

  const handleSave = async () => {
    if (!editing && (!form.username || !form.email || !form.password)) { showToast('Username, email and password required', 'error'); return; }
    if (form.password && form.password.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
    setSaving(true);
    try {
      if (editing) await updateUser(editing._id, form);
      else await createUser(form);
      showToast(editing ? 'User updated!' : 'User created!');
      setModalOpen(false); load();
    } catch (e) { showToast(e?.response?.data?.message || 'Save failed', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (id === me?._id || id === me?.id) { showToast('Cannot delete your own account', 'error'); return; }
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUser(id); showToast('User deleted!'); load(); } catch (e) { showToast(e?.response?.data?.message || 'Delete failed', 'error'); }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AdminLayout title="Users">
      {toast && <div className="toast-container"><div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div></div>}

      <div className="filter-bar">
        <div className="search-box">
          <FiSearch size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {me?.role === 'super_admin' && (
          <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add User</button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">👥 Admin Users</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total: {filtered.length}</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Avatar</th><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}><div className="empty-state"><p>Loading...</p></div></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><span className="empty-state-icon">👥</span><p>No users found</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r._id}>
                  <td><div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-light))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{r.full_name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'A'}</div></td>
                  <td><strong>{r.full_name || '—'}</strong></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>@{r.username}</td>
                  <td style={{ fontSize: 12 }}>{r.email}</td>
                  <td><span className={`badge ${ROLE_CLS[r.role] || 'badge-gray'}`}>{ROLE_MAP[r.role] || r.role}</span></td>
                  <td>{r.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span>}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{fmtDate(r.last_login)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(r)} title="Edit"><FiEdit2 size={14} /></button>
                      {me?.role === 'super_admin' && r._id !== (me?._id || me?.id) && (
                        <button className="btn-icon danger" onClick={() => handleDelete(r._id)} title="Delete"><FiTrash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? '✏️ Edit User' : '➕ Add User'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={form.full_name} onChange={e => f('full_name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Username {!editing && '*'}</label><input className="form-control" value={form.username} onChange={e => f('username', e.target.value)} disabled={!!editing} /></div>
                <div className="form-group form-full"><label className="form-label">Email *</label><input type="email" className="form-control" value={form.email} onChange={e => f('email', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Role</label>
                  <select className="form-control" value={form.role} onChange={e => f('role', e.target.value)}>
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_MAP[r]}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label><input type="password" className="form-control" value={form.password} onChange={e => f('password', e.target.value)} placeholder="Min 8 characters" /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={!!form.is_active} onChange={e => f('is_active', e.target.checked)} /> Active
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editing ? 'Update User' : 'Create User')}</button>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
