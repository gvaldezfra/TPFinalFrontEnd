import React from 'react';
import ContactItem from './ContactItem.jsx';
import './styles/ContactList.css';

export default function ContactsList({ contacts, activeContactId, onSelect }) {
  return (
    <div className="contacts-list-container">
      {contacts.map(contact => (
        <ContactItem
          key={contact.id}
          contact={contact}
          isActive={contact.id === activeContactId}
          onClick={() => onSelect(contact.id)} // 👈 más claro
        />
      ))}
    </div>
  );
}
