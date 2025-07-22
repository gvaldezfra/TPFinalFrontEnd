// src/Contexts/MessageContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import fakeChats from '../Mocks/fakeChats.json';

export const MessageContext = createContext();

const STORAGE_KEY = 'chat_messages';

export default function MessageProvider({ children }) {
  const [messagesByContact, setMessagesByContact] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Si ya hay mensajes guardados, usarlos
        return JSON.parse(stored);
      } else {
        // Primera vez: usar los mensajes fake y guardarlos
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeChats));
        return fakeChats;
      }
    } catch {
      return fakeChats;
    }
  });

  // Guardar automáticamente cada vez que cambia el estado
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesByContact));
  }, [messagesByContact]);

  // Enviar un mensaje nuevo
  const sendMessage = (contactId, text) => {
    const newMessage = {
      id: `m${Date.now()}`,
      text,
      sender: 'me',
      timestamp: Date.now(),
    };

    setMessagesByContact(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage],
    }));
  };

  // Marcar mensaje como eliminado (sin borrarlo)
  const deleteMessage = (contactId, messageId) => {
    console.log('deleteMessage called:', contactId, messageId);

    setMessagesByContact(prev => {
      const updatedMessages = (prev[contactId] || []).map(msg =>
        msg.id === messageId ? { ...msg, deleted: true } : msg
      );
      console.log('updatedMessages:', updatedMessages);

      return {
        ...prev,
        [contactId]: updatedMessages,
      };
    });
  };

  // Borrar todos los mensajes de un contacto
  const clearMessages = (contactId) => {
    setMessagesByContact(prev => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });
  };

  const getMessages = (contactId) => {
    return messagesByContact[contactId] || [];
  };

  return (
    <MessageContext.Provider value={{
      messagesByContact,
      sendMessage,
      deleteMessage,
      clearMessages,
      getMessages,
    }}>
      {children}
    </MessageContext.Provider>
  );
}
