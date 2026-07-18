import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

let _addToast = null;

export function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  _addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  return createPortal(
    <div className="adm-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`adm-toast adm-toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>,
    document.body
  );
}

export function toast(msg, type = 'success') {
  _addToast?.(msg, type);
}
