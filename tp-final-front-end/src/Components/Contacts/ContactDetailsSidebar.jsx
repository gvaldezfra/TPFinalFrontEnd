import React, { useState, useEffect } from 'react';
import { useUser } from '../../Contexts/UserContext.jsx';
import './styles/contactDetailsSidebar.css';

export default function ContactDetailsSidebar({ contact, onClose }) {
  const { user, login, deleteContact, editContact } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    if (contact) {
      setEditedName(contact.name);
      setEditedEmail(contact.email);
    }
  }, [contact]);

  if (!contact) return null;

  const favoritesList = user?.favorites || [];
  const isFavorite = favoritesList.includes(contact.id);

  const toggleFavorite = () => {
    const newFavorites = isFavorite
      ? favoritesList.filter(id => id !== contact.id)
      : [...favoritesList, contact.id];
    login({ ...user, favorites: newFavorites });
  };

  const handleDelete = () => {
    if (window.confirm(`¿Seguro que querés eliminar a ${contact.name}?`)) {
      deleteContact(contact.id);
      onClose();
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    // reset fields to original contact info
    setEditedName(contact.name);
    setEditedEmail(contact.email);
  };

  const saveEdit = () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      alert('Nombre y email no pueden estar vacíos.');
      return;
    }
    editContact({ ...contact, name: editedName.trim(), email: editedEmail.trim() });
    setIsEditing(false);
  };

  return (
    <div className="contact-detail-panel">
      <button className="close-btn" onClick={onClose}>×</button>

      {!isEditing ? (
        <>
          <h2>{contact.name}</h2>
          <img src={contact.photo} alt={contact.name} className="contact-photo" />
          <p><b>Email:</b> {contact.email}</p>

          <button onClick={toggleFavorite}>
            {isFavorite ? '⭐ Quitar favorito' : '⭐ Agregar a favoritos'}
          </button>

          <button onClick={startEditing}>
            ✏️ Editar contacto
          </button>

          <button onClick={handleDelete} className="delete-btn">
            🗑️ Eliminar contacto
          </button>
        </>
      ) : (
        <>
          <h3>Editando contacto</h3>
          <input
            type="text"
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            placeholder="Nombre"
          />
          <input
            type="email"
            value={editedEmail}
            onChange={e => setEditedEmail(e.target.value)}
            placeholder="Correo electrónico"
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={saveEdit}>Guardar</button>
            <button onClick={cancelEditing} style={{ marginLeft: 10 }}>Cancelar</button>
          </div>
        </>
      )}
    </div>
  );
}
