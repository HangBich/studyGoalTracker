import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // chan reload trang mac dinh cua form HTML
    setError('');
    setSubmitting(true);
    try {
      // async/await (Lec 5, 7): cho API tra ve roi moi chuyen trang
      await login(email, password);
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
        <h1>Log in</h1>
        {error && <p className="alert alert-error">{error}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Processing...' : 'Log in'}
        </button>

        <p className="form-foot">Don't have an account? <Link to="/register">Sign up</Link></p>
      </form>
    </main>
  );
}
