import React, { useEffect, useRef } from 'react';
import './styles/ContextMenu.css';

export default function ContextMenu({ position, onClose, onAction }) {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: position.y, left: position.x }}
    >
      <div className="context-menu-item" onClick={() => onAction('Fijar chat')}>📌 Fijar chat</div>
      <div className="context-menu-item" onClick={() => onAction('Vaciar chat')}>🧹 Vaciar chat</div>
      <div className="context-menu-item" onClick={() => onAction('Eliminar')}>🗑️ Eliminar</div>
      <div className="context-menu-item" onClick={() => onAction('Archivar')}>🗂️ Archivar</div>
    </div>
  );
}
