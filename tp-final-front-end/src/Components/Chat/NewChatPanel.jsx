import React, { useState } from 'react';
import ContactsList from '../Contacts/ContactList.jsx';
import AddContactForm from '../Contacts/AddContactForm.jsx';
import './styles/newChatPanel.css';

export default function NewChatPanel({ visible,contacts, onSelect, activeContactId, onAddContact, onClose }) {
  if (!visible) return null;
  const [showAddForm, setShowAddForm] = useState(false);

  const favoriteContacts = contacts
    .filter(c => c.isFavorite)
    .sort((a, b) => a.name.localeCompare(b.name));

  const regularContacts = contacts
    .filter(c => !c.isFavorite)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="new-chat-panel">
      <div className="sidebar-header">
        <h2>Nuevo chat</h2>
        <button className="close-button" onClick={onClose}>❌</button>
      </div>
    <span className="new-contact-span" onClick={() => setShowAddForm(true)}>
          ➕ Nuevo contacto
        </span>

      {showAddForm ? (
        <AddContactForm
          onAdd={(newContact) => {
            onAddContact(newContact);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <>
          {favoriteContacts.length > 0 && (
            <>
              <div className="section-label">⭐ Favoritos</div>
              <ContactsList
                contacts={favoriteContacts}
                activeContactId={activeContactId}
                onSelect={onSelect}
              />
            </>
          )}

          {regularContacts.length > 0 && (
            <>
              <div className="section-label">📇 Contactos</div>
              <ContactsList
                contacts={regularContacts}
                activeContactId={activeContactId}
                onSelect={onSelect}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
