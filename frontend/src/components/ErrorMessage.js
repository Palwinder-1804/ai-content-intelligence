import React from "react";

/**
 * Configured error message display.
 * Uses CSS variables from styles.css for appearance (--error-msg-*).
 *
 * @param {string} message - Error text to show
 * @param {function} onDismiss - Optional; when provided, shows a close button
 */
function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <span className="error-message-text">{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="error-message-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
