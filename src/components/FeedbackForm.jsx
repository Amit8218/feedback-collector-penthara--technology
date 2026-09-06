import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import bannerImg from '../assets/image.png';


export default function FeedbackForm({ onSubmit, isLoading }) {
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = 'Name is required';
    if (!fields.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!fields.message.trim()) {
      errs.message = 'Feedback message is required';
    } else if (fields.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ok = await onSubmit({
      name: fields.name.trim(),
      email: fields.email.trim(),
      message: fields.message.trim(),
    });

    if (ok) {
      setFields({ name: '', email: '', message: '' });
      setErrors({});
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden sticky top-6 transition-all duration-200 hover:shadow-md">
      <div className="h-28 relative bg-slate-900 overflow-hidden">
        <img
          src={bannerImg}
          alt="Abstract decorative header"
          className="w-full h-full object-cover opacity-75 transform scale-105 transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent"></div>
      </div>

      <div className="p-5 pt-3">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1 font-heading">
          Send Feedback
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          All submissions are persisted directly to MongoDB.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="form-name" className="text-xs font-semibold text-slate-700">
              Name
            </label>
            <input
              id="form-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={fields.name}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${errors.name
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
            />
            {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="form-email" className="text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <input
              id="form-email"
              name="email"
              type="email"
              placeholder="abc@xyz.com"
              value={fields.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${errors.email
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
            />
            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="form-message" className="font-semibold text-slate-700">
                Feedback
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {fields.message.length} chars
              </span>
            </div>
            <textarea
              id="form-message"
              name="message"
              rows="4"
              placeholder="Share your thoughts or suggestions..."
              value={fields.message}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition resize-none ${errors.message
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
            />
            {errors.message && <p className="text-[11px] text-red-500">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white font-semibold text-xs rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
