// src/Components/Contacts/ContactList.jsx
import React from 'react';
import ContactItem from './ContactItem.jsx';
import './styles/contactList.css';

export default function ContactsList({ contacts = [], activeContactId, onSelect, onAction }) {
  if (!Array.isArray(contacts)) return null;

  return (
    <div className="contacts-list-container">
      {contacts.map(contact => (
        <ContactItem
          key={contact.id}
          contact={contact}
          isActive={contact.id === activeContactId}
          onClick={() => onSelect(contact.id)}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
