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
        <h1>Sign up</h1>
        {error && <p className="alert alert-error">{error}</p>}

        <label htmlFor="name">Name</label>
        <input id="name" name="name" required value={form.name} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

        <label htmlFor="password">Password (minimum 6 characters)</label>
        <input id="password" name="password" type="password" required minLength={6}
          value={form.password} onChange={handleChange} />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Processing...' : 'Register'}
        </button>

        <p className="form-foot">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
