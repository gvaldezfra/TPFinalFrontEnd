// src/Components/Chat/NewMessageForm.jsx
import React, { useState } from 'react';

export default function NewMessageForm({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, paddingTop: 10 }}>
      <input
        type="text"
        placeholder="Escribí un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 20,
          border: '1px solid #ccc',
        }}
      />
      <button type="submit" style={{ padding: '10px 16px' }}>
        Enviar
      </button>
    </form>
  );
}
