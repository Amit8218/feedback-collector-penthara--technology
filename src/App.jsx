import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import ModalComponent from './components/ModalComponent';
import { fetchFeedbacks, submitFeedback, removeFeedback } from './services/FeedbackService';
import bannerImg from './assets/image.png';
import './assets/index.css';

function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);
  return debouncedValue;
}

function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showToast = useCallback((text, variant = 'success', duration = 3500) => {
    clearTimer();
    setToast({ text, variant });
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, duration);
  }, []);

  useEffect(() => () => clearTimer(), []);

  return { toast, showToast };
}

const resolveSort = (sortKey) => {
  switch (sortKey) {
    case 'oldest':
      return { sortBy: 'createdAt', order: 'asc' };
    case 'name-asc':
      return { sortBy: 'name', order: 'asc' };
    case 'name-desc':
      return { sortBy: 'name', order: 'desc' };
    case 'newest':
    default:
      return { sortBy: 'createdAt', order: 'desc' };
  }
};

export default function App() {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeDeleteId, setActiveDeleteId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateParam, setDateParam] = useState('');
  const [sortParam, setSortParam] = useState('newest');

  const { toast, showToast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    let isSubscribed = true;

    async function loadFeedback() {
      try {
        setLoading(true);
        const { sortBy, order } = resolveSort(sortParam);
        const data = await fetchFeedbacks({
          search: debouncedSearch,
          date: dateParam,
          sortBy,
          order,
        });
        if (isSubscribed) {
          setFeedbackItems(data);
        }
      } catch {
        if (isSubscribed) {
          showToast('Could not load feedback items from the server.', 'error');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    loadFeedback();

    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearch, dateParam, sortParam, showToast]);

  async function handleCreate(payload) {
    try {
      setSaving(true);
      const createdItem = await submitFeedback(payload);
      setFeedbackItems((previousItems) => [createdItem, ...previousItems]);
      showToast('Feedback submitted successfully!');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!activeDeleteId) return;
    try {
      await removeFeedback(activeDeleteId);
      setFeedbackItems((previousItems) =>
        previousItems.filter((item) => item.id !== activeDeleteId)
      );
      showToast('Feedback entry deleted.');
    } catch {
      showToast('Failed to delete feedback entry.', 'error');
    } finally {
      setActiveDeleteId(null);
    }
  }

  function handleResetFilters() {
    setSearchTerm('');
    setDateParam('');
    setSortParam('newest');
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 text-slate-900 font-sans">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="relative w-full h-36 sm:h-44 rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-950 flex items-end p-6 sm:p-8 shadow-sm group">
          <img
            src={bannerImg}
            alt="Abstract background"
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Feedback Collector
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Collect, search, filter, and sort user feedback directly from MongoDB.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          <FeedbackForm onSubmit={handleCreate} isLoading={saving} />

          <FeedbackList
            entries={feedbackItems}
            search={searchTerm}
            dateFilter={dateParam}
            sortOrder={sortParam}
            loading={loading}
            onSearchChange={setSearchTerm}
            onDateFilterChange={setDateParam}
            onSortOrderChange={setSortParam}
            onClearFilters={handleResetFilters}
            onDelete={(id) => setActiveDeleteId(id)}
          />
        </div>
      </main>

      <ModalComponent
        isOpen={Boolean(activeDeleteId)}
        onClose={() => setActiveDeleteId(null)}
        onConfirm={handleDelete}
      />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-2xl text-xs font-semibold animate-modal-pop ${
            toast.variant === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-slate-900/95 backdrop-blur-xs border-slate-800 text-white'
          }`}
        >
          {toast.variant === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}