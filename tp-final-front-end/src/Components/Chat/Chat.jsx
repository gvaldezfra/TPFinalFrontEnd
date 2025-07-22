import React from 'react';
import Message from './Message.jsx';
import NewMessageForm from './NewMessageForm.jsx';
import './styles/chat.css';

export default function Chat({ contact, messages, onSendMessage, onDeleteMessage }) {
  if (!contact) {
    return <div style={{ flex: 1, padding: 20 }}>Seleccioná un contacto</div>;
  }

  const handleDeleteMessage = (messageId) => {
    onDeleteMessage(contact.id, messageId);
  };

  return (
    <div className="chat-container">

      <div className="messages-wrapper">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender === 'me' ? 'own' : 'theirs'}`}
          >
            <Message
              message={msg}
              isOwn={msg.sender === 'me'}
              onDelete={handleDeleteMessage}
            />
          </div>
        ))}
      </div>

      <NewMessageForm onSend={onSendMessage} />
    </div>
  );
}
