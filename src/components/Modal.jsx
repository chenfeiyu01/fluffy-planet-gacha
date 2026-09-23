import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
export default function Modal({ title, onClose, children, className = "" }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    const close = (e) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", close);
    return () => {
      dialog.removeEventListener("cancel", close);
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="icon-button modal-close"
        onClick={onClose}
        aria-label="关闭"
      >
        <X size={22} />
      </button>
      {children}
    </dialog>
  );
}
