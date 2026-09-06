import { AlertTriangle } from 'lucide-react';

export default function ModalComponent({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Feedback',
  message = 'Are you sure you want to delete this feedback item? This action cannot be undone.',
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 text-center animate-modal-pop relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-pulse-glow"></div>
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1.5 font-heading">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] rounded-xl shadow-sm shadow-rose-600/30 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
