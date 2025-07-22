import React from 'react';
import Message from './Message.jsx';
import NewMessageForm from './NewMessageForm.jsx';
import './styles/chat.css';

export default function Chat({ contact, messages, onSendMessage }) {
  if (!contact) {
    return <div style={{ flex: 1, padding: 20 }}>Seleccioná un contacto</div>;
  }

  return (
    <div className= 'chat-container' style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', padding: 20 }}>
      <div style={{ marginBottom: 10, fontWeight: 'bold' }}>{contact.name}</div>

      <div
        style={{
          backgroundColor: 'var(--chat-bg)',
          width: '100%',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender === 'me' ? 'own' : 'theirs'}`}
          >
            <Message
              message={msg}
              isOwn={msg.sender === 'me'}
              contactId={contact.id}
            />
          </div>
        ))}
      </div>

      <NewMessageForm onSend={onSendMessage} />
    </div>
  );
}
