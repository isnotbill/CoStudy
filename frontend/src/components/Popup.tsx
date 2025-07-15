import ReactDOM from 'react-dom';

interface PopupProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup = ({ show, onClose, children }: PopupProps) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-lg p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 bg-white/20 dark:bg-[#1a1a2c]/60 backdrop-blur-md text-gray-900 dark:text-gray-100 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition"
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Popup Content */}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
