import { Link } from 'react-router-dom';

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

export default function GoalCard({ goal, onQuickAdd }) {
  return (
    <article className="card">
      <div className="card-head">
        <Link to={`/goals/${goal._id}`} className="card-title">{goal.title}</Link>
        <span className={`badge badge-${goal.status}`}>{STATUS_LABEL[goal.status]}</span>
      </div>

      <p className="card-meta">
        {SUBJECT_LABEL[goal.subject]}
        {goal.deadline && ` - Deadline: ${new Date(goal.deadline).toLocaleDateString('vi-VN')}`}
      </p>

      {/* progress la virtual field do backend tinh, khong luu trong DB */}
      <div className="progress-bar" role="progressbar" aria-valuenow={goal.progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
      </div>

      <div className="card-foot">
        <span className="card-numbers">
          {goal.currentValue}/{goal.targetValue} {UNIT_LABEL[goal.unit]} ({goal.progress}%)
        </span>
        <button className="btn btn-small" onClick={() => onQuickAdd(goal._id, 1)}>
          +1 {UNIT_LABEL[goal.unit]}
        </button>
      </div>
    </article>
  );
}
