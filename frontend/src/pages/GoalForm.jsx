import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

// These values MUST match the enum in backend/src/models/Goal.js
const SUBJECTS = ['coursework', 'project', 'programming', 'language', 'certification', 'reading', 'other'];
const SUBJECT_LABEL = {
  coursework: 'Coursework',
  project: 'Project / Assignment',
  programming: 'Programming skills',
  language: 'Language',
  certification: 'Certification',
  reading: 'Reading',
  other: 'Other',
};

const STATUSES = ['dang-lam', 'hoan-thanh', 'tam-dung'];
const STATUS_LABEL = {
  'dang-lam': 'In progress', 'hoan-thanh': 'Completed', 'tam-dung': 'Paused',
};

// Values stay as-is because the backend enum for unit is unchanged.
// Only the display labels are translated - data and presentation are separate.
const UNITS = ['chuong', 'trang', 'bai', 'gio', 'buoi'];
const UNIT_LABEL = {
  chuong: 'chapters', trang: 'pages', bai: 'exercises', gio: 'hours', buoi: 'sessions',
};

// One component serves BOTH create and edit.
// The two modes are told apart by whether the URL carries an :id.
export default function GoalForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', subject: 'other', unit: 'bai',
    targetValue: 1, currentValue: 0, deadline: '', status: 'dang-lam',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // In edit mode, load the existing goal and populate the form
  useEffect(() => {
    if (!isEdit) return;
    axiosClient
      .get(`/goals/${id}`)
      .then((res) => {
        const g = res.data.data;
        setForm({
          title: g.title,
          description: g.description || '',
          subject: g.subject,
          unit: g.unit,
          targetValue: g.targetValue,
          currentValue: g.currentValue,
          status: g.status,
          // input type="date" only accepts the YYYY-MM-DD format
          deadline: g.deadline ? g.deadline.slice(0, 10) : '',
        });
      })
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...form,
      targetValue: Number(form.targetValue),
      currentValue: Number(form.currentValue),
      deadline: form.deadline || null,
    };

    try {
      if (isEdit) {
        await axiosClient.put(`/goals/${id}`, payload);
      } else {
        await axiosClient.post('/goals', payload);
      }
      navigate('/');
    } catch (err) {
      // This error comes from express-validator or Mongoose validation on the server
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <h1>{isEdit ? 'Edit goal' : 'Add a goal'}</h1>
      {error && <p className="alert alert-error">{error}</p>}

      <form className="goal-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Goal title <span className="required">*</span></label>
        {/* required + maxLength form the FIRST validation layer (HTML5) */}
        <input id="title" name="title" required maxLength={200}
          value={form.title} onChange={handleChange}
          placeholder="What do you want to achieve?" />

        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows={3} maxLength={1000}
          value={form.description} onChange={handleChange} />

        <div className="form-row">
          <div>
            <label htmlFor="subject">Category <span className="required">*</span></label>
            <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{SUBJECT_LABEL[s]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="unit">Unit <span className="required">*</span></label>
            <select id="unit" name="unit" value={form.unit} onChange={handleChange}>
              {UNITS.map((u) => <option key={u} value={u}>{UNIT_LABEL[u]}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="targetValue">Target <span className="required">*</span></label>
            <input id="targetValue" name="targetValue" type="number" required min={1}
              value={form.targetValue} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="currentValue">Completed so far</label>
            <input id="currentValue" name="currentValue" type="number" min={0}
              value={form.currentValue} onChange={handleChange} />
          </div>
        </div>

        {/* Status is only editable when updating - a new goal always starts as "In progress" */}
        {isEdit && (
          <>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </>
        )}

        <label htmlFor="deadline">Deadline (optional)</label>
        {/* min blocks past dates in the date picker - UX only, the server enforces it too */}
        <input id="deadline" name="deadline" type="date"
          min={new Date().toISOString().slice(0, 10)}
          value={form.deadline} onChange={handleChange} />

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <Link to="/" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </main>
  );
}