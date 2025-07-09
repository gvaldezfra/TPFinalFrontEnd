// src/Contexts/MessageContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const MessageContext = createContext();

const STORAGE_KEY = 'chat_messages';

export function MessageProvider({ children }) {
    // Inicializar desde localStorage si hay datos
    const [messagesByContact, setMessagesByContact] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    // Guardar en localStorage cuando cambia messagesByContact
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesByContact));
    }, [messagesByContact]);

    // Enviar un mensaje nuevo
    const sendMessage = (contactId, text) => {
        const newMessage = {
            id: `m${Date.now()}`, // ID único
            text,
            sender: 'me',
            timestamp: Date.now(),
        };

        setMessagesByContact(prev => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), newMessage],
        }));
    };

    // Borrar un mensaje por id
    const deleteMessage = (contactId, messageId) => {
        setMessagesByContact(prev => ({
            ...prev,
            [contactId]: (prev[contactId] || []).filter(msg => msg.id !== messageId),
        }));
    };

    // Borrar todos los mensajes de un contacto
    const clearMessages = (contactId) => {
        setMessagesByContact(prev => {
            const copy = { ...prev };
            delete copy[contactId];
            return copy;
        });
    };

    // Obtener mensajes de un contacto (opcional)
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