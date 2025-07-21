import React from 'react';
import './styles/ContactItem.css';


function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
}

export default function ContactItem({ contact, isActive, onClick, onContextMenu }) {
    const { name, photo, lastMessage, lastMessageTime } = contact;

    return (
        <div
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault(); // Previene el menú del navegador
                if (onContextMenu) {
                    onContextMenu(e, contact); // Le pasamos el evento y el contacto
                }
            }}
            className={`contact-item ${isActive ? 'active' : ''}`}
        >
            <div className="contact-content">
                <img src={photo} alt={name} className="contact-photo" />
                <div className="contact-texts">
                    <div className="contact-name">{name}</div>
                    <div className="contact-last-message" title={lastMessage}>
                        {lastMessage || 'Sin mensajes aún'}
                    </div>
                </div>
            </div>
            <div className="contact-time">
                {formatTime(lastMessageTime)}
            </div>
        </div>
    );
}
