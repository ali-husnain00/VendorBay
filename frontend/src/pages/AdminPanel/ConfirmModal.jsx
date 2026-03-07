import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  if (!open) return null;

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="admin-modal-card">
        <h2 id="admin-modal-title" className="admin-modal-title">{title}</h2>
        {message && <p className="admin-modal-message">{message}</p>}
        <div className="admin-modal-actions">
          <button type="button" className="admin-modal-btn admin-modal-btn-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-modal-btn admin-modal-btn-confirm admin-modal-btn-${variant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
