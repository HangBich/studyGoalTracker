import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import GoalCard from '../components/GoalCard';

const SUBJECTS = [
  { value: '', label: 'Tat ca mon' },
  { value: 'toan', label: 'Toan' },
  { value: 'ly', label: 'Ly' },
  { value: 'hoa', label: 'Hoa' },
  { value: 'tin', label: 'Tin hoc' },
  { value: 'ngoai-ngu', label: 'Ngoai ngu' },
  { value: 'chuyen-nganh', label: 'Chuyen nganh' },
  { value: 'khac', label: 'Khac' },
];

const STATUSES = [
  { value: '', label: 'Tat ca trang thai' },
  { value: 'dang-lam', label: 'Dang lam' },
  { value: 'hoan-thanh', label: 'Hoan thanh' },
  { value: 'tam-dung', label: 'Tam dung' },
];

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useCallback de ham nay khong bi tao lai moi lan render,
  // nho vay useEffect ben duoi chi chay khi subject/status doi that su.
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Loc o SERVER bang query param, khong tai het roi loc bang JS
      const res = await axiosClient.get('/goals', { params: { subject, status } });
      setGoals(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [subject, status]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]); // dependency array: chay lai khi bo loc doi

  async function handleQuickAdd(id, delta) {
    try {
      const res = await axiosClient.patch(`/goals/${id}/progress`, { delta });
      // Cap nhat lai dung 1 phan tu trong mang, khong goi lai ca danh sach
      setGoals((prev) => prev.map((g) => (g._id === id ? res.data.data : g)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <div className="page-head">
        <h1>Muc tieu hoc tap</h1>
        <Link to="/goals/new" className="btn btn-primary">+ Them muc tieu</Link>
      </div>

      <div className="filters">
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Loc theo mon hoc">
          {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Loc theo trang thai">
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {error && <p className="alert alert-error">{error}</p>}
      {loading && <p className="muted">Dang tai...</p>}

      {!loading && goals.length === 0 && (
        <p className="muted">Chua co muc tieu nao. Bam "Them muc tieu" de bat dau.</p>
      )}

      <div className="goal-grid">
        {goals.map((goal) => (
          <GoalCard key={goal._id} goal={goal} onQuickAdd={handleQuickAdd} />
        ))}
      </div>
    </main>
  );
}
