import { Search, X, Inbox, Loader2 } from 'lucide-react';
import FeedbackItem from './FeedbackItem';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
];

export default function FeedbackList({
  entries = [],
  search = '',
  dateFilter = '',
  sortOrder = 'newest',
  loading = false,
  onSearchChange,
  onDateFilterChange,
  onSortOrderChange,
  onClearFilters,
  onDelete,
}) {
  const isFiltering = Boolean(search || dateFilter);

  return (
    <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-slate-900 font-heading">Feedback History</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
            {entries.length === 1 ? '1 entry' : `${entries.length} entries`}
          </span>
          {loading && (
            <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </span>
          )}
        </div>

        {isFiltering && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="search-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              placeholder="Search keyword..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="date-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Filter by date
          </label>
          <input
            id="date-input"
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="sort-select" className="block text-xs font-semibold text-slate-700 mb-1">
            Sort order
          </label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition font-medium cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[540px] overflow-y-auto pr-1">
        {entries.length > 0 ? (
          entries.map((item) => (
            <FeedbackItem key={item.id} entry={item} onDelete={onDelete} />
          ))
        ) : (
          <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/60 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2.5">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 font-heading">No feedback entries found</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {isFiltering
                ? 'Try adjusting or clearing your active filters.'
                : 'Submit your first message using the form on the left.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
