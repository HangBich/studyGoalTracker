import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="center-box">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Dang ky</h1>
        {error && <p className="alert alert-error">{error}</p>}

        <label htmlFor="name">Ho ten</label>
        <input id="name" name="name" required value={form.name} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

        <label htmlFor="password">Mat khau (toi thieu 6 ky tu)</label>
        <input id="password" name="password" type="password" required minLength={6}
          value={form.password} onChange={handleChange} />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Dang xu ly...' : 'Dang ky'}
        </button>

        <p className="form-foot">Da co tai khoan? <Link to="/login">Dang nhap</Link></p>
      </form>
    </main>
  );
}
