// =============================================
// components/Toast.jsx
// =============================================
// Simple popup notification (success or error)
// Usage: <Toast message="Added!" type="success" onClose={() => setToast(null)} />

import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === 'success' ? '✓' : '✕';

  return (
    <div className={`toast ${type}`} onClick={onClose} style={{ cursor: 'pointer' }}>
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
