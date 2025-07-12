import React from 'react';
import Message from './Message.jsx';
import NewMessageForm from './NewMessageForm.jsx';

export default function Chat({ contact, messages, onSendMessage }) {
  if (!contact) {
    return <div style={{ flex: 1, padding: 20 }}>Seleccioná un contacto</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
      <div style={{ marginBottom: 10, fontWeight: 'bold' }}>{contact.name}</div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            isOwn={msg.sender === 'me'}
            contactId={contact.id}
          />
        ))}
      </div>

      <NewMessageForm onSend={onSendMessage} />
    </div>
  );
}
