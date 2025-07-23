import React, { useState, useRef, useEffect } from 'react';
import './styles/contactItem.css';

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }
}

export default function ContactItem({ contact, isActive, onClick, onAction }) {
  const { name, photo, lastMessage, lastMessageTime, isPinned } = contact;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation(); // evitar que se dispare onClick general
    setShowMenu(prev => !prev);
  };

  const handleAction = (action) => {
    setShowMenu(false);
    onAction?.(action, contact);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div
      className={`contact-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <img src={photo} alt={name} className="contact-photo" />
      <div className="contact-texts">
        <div className="contact-name">
          {name} {isPinned && <span className="pinned-tag">📌 Fijado</span>}
        </div>
        <div className="contact-last-message">
          {lastMessage || 'Sin mensajes aún'}
          <span className='contact-time'>
            {formatTime(lastMessageTime)}
          </span>
        </div>
      </div>

      {/* Botón de menú */}
      <div className="contact-options" ref={menuRef}>
        <button className="options-btn" onClick={toggleMenu}>⋮</button>
        {showMenu && (
          <div className="options-menu">
            <div onClick={() => handleAction('pin')}>
              {isPinned ? '📌 Quitar fijado' : '📌 Fijar chat'}
            </div>
            <div onClick={() => handleAction('clear')}>🧹 Vaciar chat</div>
          </div>
        )}
      </div>
    </div>
  );
}
