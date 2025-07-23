import React, { createContext, useState, useEffect } from 'react';
import fakeChats from '../Mocks/fakeChats.json';

export const MessageContext = createContext();

const STORAGE_KEY = 'chat_messages';

export default function MessageProvider({ children }) {
  const [messagesByContact, setMessagesByContact] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          console.log('Loaded messages from sessionStorage:', parsed);
          return parsed;
        }
        console.warn('Stored messages invalid, loading fakeChats');
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fakeChats));
        return fakeChats;
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fakeChats));
        console.log('Loaded messages from fakeChats');
        return fakeChats;
      }
    } catch (e) {
      console.error('Error loading messages:', e);
      return fakeChats;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messagesByContact));
  }, [messagesByContact]);

  const sendMessage = (contactId, messageContent) => {
    const newMessage = {
      id: `m${Date.now()}`,
      text: messageContent,
      sender: 'me',
      timestamp: Date.now(),
    };

    setMessagesByContact((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage],
    }));
  };

  const deleteMessage = (contactId, messageId) => {
    setMessagesByContact((prev) => {
      const updatedMessages = (prev[contactId] || []).map((msg) =>
        msg.id === messageId ? { ...msg, deleted: true } : msg
      );

      return {
        ...prev,
        [contactId]: updatedMessages,
      };
    });
  };

  const clearMessages = (contactId) => {
    setMessagesByContact((prev) => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });
  };

  const getMessages = (contactId) => {
    return messagesByContact[contactId] || [];
  };

  return (
    <MessageContext.Provider
      value={{
        messagesByContact,
        sendMessage,
        deleteMessage,
        clearMessages,
        getMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
