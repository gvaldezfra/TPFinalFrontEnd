import React from 'react';
import './styles/contactItem.css';
import { useState } from 'react';


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
  const { name, photo, lastMessage, lastMessageTime, isArchived } = contact;
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // evitar que se dispare el onClick general
    setShowMenu(prev => !prev);
  };

  const handleAction = (action) => {
    setShowMenu(false);
    onAction?.(action, contact);
  };

  return (
    <div
      className={`contact-item ${isActive ? 'active' : ''} ${isArchived ? 'archived' : ''}`}
      onClick={onClick}
    >
      <img src={photo} alt={name} className="contact-photo" />
      <div className="contact-texts">
        <div className="contact-name">
          {name} {isArchived && <span className="archived-tag">🗄️</span>}
        </div>
        <div className="contact-last-message">
          {lastMessage || 'Sin mensajes aún'}
          <span className='contact-time'>
            {formatTime(lastMessageTime)}
          </span>
        </div>
      </div>

      {/* Botón de menú */}
      <div className="contact-options">
        <button className="options-btn" onClick={toggleMenu}>⋮</button>
        {showMenu && (
          <div className="options-menu">
            <div onClick={() => handleAction('pin')}>📌 Fijar chat</div>
            <div onClick={() => handleAction('clear')}>🧹 Vaciar chat</div>
            <div onClick={() => handleAction('archive')}>🗄️ Archivar</div>
            <div onClick={() => handleAction('delete')}>🗑️ Eliminar</div>
          </div>
        )}
      </div>
    </div>
  );
}