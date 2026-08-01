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
        <h1>Dang nhap</h1>
        {error && <p className="alert alert-error">{error}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

        <label htmlFor="password">Mat khau</label>
        <input id="password" type="password" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Dang xu ly...' : 'Dang nhap'}
        </button>

        <p className="form-foot">Chua co tai khoan? <Link to="/register">Dang ky</Link></p>
      </form>
    </main>
  );
}
