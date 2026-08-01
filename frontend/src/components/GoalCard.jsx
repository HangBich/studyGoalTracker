import { Link } from 'react-router-dom';

const SUBJECT_LABEL = {
  toan: 'Toan', ly: 'Ly', hoa: 'Hoa', tin: 'Tin hoc',
  'ngoai-ngu': 'Ngoai ngu', 'chuyen-nganh': 'Chuyen nganh', khac: 'Khac',
};

const STATUS_LABEL = {
  'dang-lam': 'Dang lam', 'hoan-thanh': 'Hoan thanh', 'tam-dung': 'Tam dung',
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
        {goal.deadline && ` - Han: ${new Date(goal.deadline).toLocaleDateString('vi-VN')}`}
      </p>

      {/* progress la virtual field do backend tinh, khong luu trong DB */}
      <div className="progress-bar" role="progressbar" aria-valuenow={goal.progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-fill" style={{ width: `${goal.progress}%` }} />
      </div>

      <div className="card-foot">
        <span className="card-numbers">
          {goal.currentValue}/{goal.targetValue} {goal.unit} ({goal.progress}%)
        </span>
        <button className="btn btn-small" onClick={() => onQuickAdd(goal._id, 1)}>
          +1 {goal.unit}
        </button>
      </div>
    </article>
  );
}
