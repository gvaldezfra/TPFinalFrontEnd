import React from 'react';
import { useUser } from '../../Contexts/UserContext.jsx';
import './styles/contactDetailsSidebar.css';

export default function ContactDetailsSidebar({ contact, onClose }) {
  const { user, login, blockContact, unblockContact } = useUser();

  if (!contact) return null;

  // Defensas para blocked y favorites:
  const blocked = user?.blocked || [];
  const favorites = user?.favorites || [];

  const isBlocked = blocked.includes(contact.id);
  const isFavorite = favorites.includes(contact.id);

  const toggleBlock = () => {
    if (isBlocked) {
      unblockContact(contact.id);
    } else {
      blockContact(contact.id);
    }
  };

  const toggleFavorite = () => {
    const newFavorites = isFavorite
      ? favorites.filter(id => id !== contact.id)
      : [...favorites, contact.id];

    login({ ...user, favorites: newFavorites });
  };

  const deleteContact = () => {
  if (window.confirm(`¿Seguro que querés eliminar a ${contact.name}?`)) {
    const updatedContacts = user.contacts.filter(c => c.id !== contact.id);
    login({ ...user, contacts: updatedContacts });

    onClose(); // cerramos el panel si querés
    }
  };

  return (
    <div className="contact-detail-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>{contact.name}</h2>
      <img src={contact.photo} alt={contact.name} className="contact-photo" />

      <button onClick={toggleFavorite}>
        {isFavorite ? '⭐ Quitar favorito' : '⭐ Agregar a favoritos'}
      </button>

      <button onClick={toggleBlock}>
        {isBlocked ? '🔓 Desbloquear contacto' : '🔒 Bloquear contacto'}
      </button>

      <button onClick={deleteContact} className="delete-btn">
        🗑️ Eliminar contacto
      </button>
    </div>
  );
}
