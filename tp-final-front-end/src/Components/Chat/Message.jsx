import React, { useContext } from 'react';
import { MessageContext } from '../../Contexts/MessageContext.jsx';
import './styles/Message.css';

export default function Message({ message, isOwn, contactId }) {
  const { deleteMessage } = useContext(MessageContext);

  const handleDelete = () => {
    if (window.confirm('¿Querés eliminar este mensaje?')) {
      deleteMessage(contactId, message.id);
    }
  };

  if (message.deleted) {
    return (
      <div className={`message-deleted ${isOwn ? 'own' : ''}`}>
        Has eliminado este mensaje
      </div>
    );
  }

  return (
    <div className={`message ${isOwn ? 'own' : 'theirs'}`}>
      <span>{message.text}</span>
      {isOwn && (
        <button
          onClick={handleDelete}
          className="message-delete-button"
          aria-label="Eliminar mensaje"
          title="Eliminar mensaje"
        >
          ×
        </button>
      )}
    </div>
  );
}
