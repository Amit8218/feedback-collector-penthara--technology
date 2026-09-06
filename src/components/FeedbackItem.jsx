  import { Trash2 } from 'lucide-react';

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

export default function FeedbackItem({ entry, onDelete }) {
  const { id, name, email, message, date } = entry;
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const initials = parts.length ? (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase() : '?';

  return (
    <article className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate font-heading">{name}</h3>
            <a href={`mailto:${email}`} className="text-xs text-slate-500 hover:text-indigo-600 transition-colors truncate block">
              {email}
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
          <time className="text-xs text-slate-400 font-mono" dateTime={date ? new Date(date).toISOString() : undefined}>
            {formatDate(date)}
          </time>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="w-7 h-7 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete feedback entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words border-t border-slate-100 pt-2.5">
        {message}
      </p>
    </article>
  );
}
