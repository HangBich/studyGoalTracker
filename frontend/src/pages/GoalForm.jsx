import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const SUBJECTS = ['toan', 'ly', 'hoa', 'tin', 'ngoai-ngu', 'chuyen-nganh', 'khac'];
const SUBJECT_LABEL = {
  toan: 'Toan', ly: 'Ly', hoa: 'Hoa', tin: 'Tin hoc',
  'ngoai-ngu': 'Ngoai ngu', 'chuyen-nganh': 'Chuyen nganh', khac: 'Khac',
};
const UNITS = ['chuong', 'trang', 'bai', 'gio', 'buoi'];

// Mot component dung cho CA tao moi VA sua.
// Phan biet bang viec URL co :id hay khong.
export default function GoalForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', subject: 'khac', unit: 'bai',
    targetValue: 1, currentValue: 0, deadline: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Neu la sua thi tai du lieu cu ve do vao form
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
          // input type="date" chi nhan dinh dang YYYY-MM-DD
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
      // Loi nay den tu express-validator hoac Mongoose validate o server
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <h1>{isEdit ? 'Sua muc tieu' : 'Them muc tieu'}</h1>
      {error && <p className="alert alert-error">{error}</p>}

      <form className="goal-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Ten muc tieu</label>
        {/* required + maxLength la lop validate THU NHAT (HTML5) */}
        <input id="title" name="title" required maxLength={200}
          value={form.title} onChange={handleChange}
          placeholder="Vi du: Doc xong Clean Code" />

        <label htmlFor="description">Mo ta (khong bat buoc)</label>
        <textarea id="description" name="description" rows={3} maxLength={1000}
          value={form.description} onChange={handleChange} />

        <div className="form-row">
          <div>
            <label htmlFor="subject">Mon hoc</label>
            <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{SUBJECT_LABEL[s]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="unit">Don vi</label>
            <select id="unit" name="unit" value={form.unit} onChange={handleChange}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="targetValue">Muc tieu</label>
            <input id="targetValue" name="targetValue" type="number" required min={1}
              value={form.targetValue} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="currentValue">Da lam duoc</label>
            <input id="currentValue" name="currentValue" type="number" min={0}
              value={form.currentValue} onChange={handleChange} />
          </div>
        </div>

        <label htmlFor="deadline">Han hoan thanh (khong bat buoc)</label>
        <input id="deadline" name="deadline" type="date"
          value={form.deadline} onChange={handleChange} />

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Dang luu...' : 'Luu'}
          </button>
          <Link to="/" className="btn btn-ghost">Huy</Link>
        </div>
      </form>
    </main>
  );
}
