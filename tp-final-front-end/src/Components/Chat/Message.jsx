import React, { useContext } from 'react';
import { MessageContext } from '../../Contexts/MessageContext.jsx';

export default function Message({ message, isOwn, contactId }) {
  const { deleteMessage } = useContext(MessageContext);

  const handleDelete = () => {
    if (window.confirm('¿Querés eliminar este mensaje?')) {
      deleteMessage(contactId, message.id);
    }
  };

  if (message.deleted) {
    return (
      <div
        style={{
          alignSelf: isOwn ? 'flex-end' : 'flex-start',
          fontStyle: 'italic',
          color: '#888',
          padding: '8px 12px',
          margin: '4px 0',
          maxWidth: '70%',
          borderRadius: '15px',
          backgroundColor: '#f0f0f0',
          wordBreak: 'break-word',
        }}
      >
        Has eliminado este mensaje
      </div>
    );
  }

  return (
    <div
      style={{
        alignSelf: isOwn ? 'flex-end' : 'flex-start',
        backgroundColor: isOwn ? '#dcf8c6' : '#f1f0f0',
        color: '#000',
        padding: '8px 12px',
        margin: '4px 0',
        borderRadius: '15px',
        maxWidth: '70%',
        wordBreak: 'break-word',
        position: 'relative',
      }}
    >
      {message.text}

      {isOwn && (
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: 2,
            right: 4,
            border: 'none',
            background: 'transparent',
            color: '#888',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
          aria-label="Eliminar mensaje"
          title="Eliminar mensaje"
        >
          ×
        </button>
      )}
    </div>
  );
}
