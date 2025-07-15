import React, { useState } from 'react';
import './styles/newMessageForm.css';

export default function NewMessageForm({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="new-message-form">
      <input
        className="new-message-input"
        type="text"
        placeholder="Escribí un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="new-message-button">
        Enviar
      </button>
    </form>
  );
}
