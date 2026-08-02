import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const SUBJECT_LABEL = {
  coursework: 'Coursework',
  project: 'Project / Assignment',
  programming: 'Programming skills',
  language: 'Language',
  certification: 'Certification',
  reading: 'Reading',
  other: 'Other',
};

const STATUS_LABEL = {
  'dang-lam': 'In progress', 'hoan-thanh': 'Completed', 'tam-dung': 'Paused',
};

const UNIT_LABEL = {
  chuong: 'chapters', trang: 'pages', bai: 'exercises', gio: 'hours', buoi: 'sessions',
};

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(`/goals/${id}`)
      .then((res) => setGoal(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function changeProgress(delta) {
    try {
      const res = await axiosClient.patch(`/goals/${id}/progress`, { delta });
      setGoal(res.data.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await axiosClient.delete(`/goals/${id}`); // server returns 204 No Content
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <main className="container"><p className="muted">Loading...</p></main>;
  if (error) return <main className="container"><p className="alert alert-error">{error}</p></main>;
  if (!goal) return null;

  return (
    <main className="container">
      <Link to="/" className="back-link">&larr; Back to list</Link>

      <div className="page-head">
        <h1>{goal.title}</h1>
        <span className={`badge badge-${goal.status}`}>{STATUS_LABEL[goal.status]}</span>
      </div>

      {goal.description && <p>{goal.description}</p>}

      <dl className="detail-list">
        <div><dt>Category</dt><dd>{SUBJECT_LABEL[goal.subject]}</dd></div>
        <div><dt>Progress</dt><dd>{goal.currentValue}/{goal.targetValue} {UNIT_LABEL[goal.unit]}</dd></div>
        <div><dt>Deadline</dt>
          <dd>{goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-GB') : 'No deadline'}</dd>
        </div>
      </dl>

      <div className="progress-bar" role="progressbar" aria-valuenow={goal.progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
      </div>
      <p className="muted">{goal.progress}% complete</p>

      <div className="detail-actions">
        <button className="btn" onClick={() => changeProgress(-1)}>-1</button>
        <button className="btn btn-primary" onClick={() => changeProgress(1)}>+1 {UNIT_LABEL[goal.unit]}</button>
        <Link to={`/goals/${goal._id}/edit`} className="btn btn-ghost">Edit</Link>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </main>
  );
}