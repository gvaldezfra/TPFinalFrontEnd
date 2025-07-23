import React from 'react';
import './styles/message.css';

export default function Message({ message, isOwn, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('¿Querés eliminar este mensaje?')) {
      onDelete(message.id);
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
      {typeof message.text === 'string' ? (
        <span>{message.text}</span>
      ) : message.text?.type === 'image' ? (
        <img
          src={message.text.data}
          alt="Imagen enviada"
          loading="lazy"
          style={{
            maxWidth: '200px',
            maxHeight: '200px',
            borderRadius: '8px',
            marginTop: '5px',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span>Contenido no soportado</span>
      )}
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
