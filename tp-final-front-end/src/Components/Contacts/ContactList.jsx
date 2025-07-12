import React from 'react';
import ContactItem from './ContactItem.jsx';

export default function ContactsList({ contacts, activeContactId, onSelect }) {
  return (
    <div
      style={{
        width: 250,
        borderRight: '1px solid #ccc',
        overflowY: 'auto',
        height: '100vh',
      }}
    >
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
