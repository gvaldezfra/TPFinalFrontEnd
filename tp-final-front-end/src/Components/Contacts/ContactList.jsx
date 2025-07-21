import React, { useState, useRef, useEffect } from 'react';
import ContactItem from './ContactItem.jsx';
import './styles/ContactList.css';

export default function ContactsList({ contacts, activeContactId, onSelect }) {
  const [contextMenu, setContextMenu] = useState(null); // { x, y, contact }
  const menuRef = useRef();

  const handleContextMenu = (e, contact) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      contact
    });
  };

  const handleOptionClick = (option) => {
    alert(`Opción seleccionada: ${option} para ${contextMenu.contact.name}`);
    setContextMenu(null);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setContextMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="contacts-list-container">
      {contacts.map(contact => (
        <ContactItem
          key={contact.id}
          contact={contact}
          isActive={contact.id === activeContactId}
          onClick={() => onSelect(contact.id)}
          onContextMenu={handleContextMenu}
        />
      ))}

      {contextMenu && (
        <div
          ref={menuRef}
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div onClick={() => handleOptionClick('Fijar chat')}>📌 Fijar chat</div>
          <div onClick={() => handleOptionClick('Vaciar chat')}>🗑️ Vaciar chat</div>
          <div onClick={() => handleOptionClick('Eliminar')}>❌ Eliminar</div>
          <div onClick={() => handleOptionClick('Archivar')}>📦 Archivar</div>
        </div>
      )}
    </div>
  );
}
