import React from 'react';

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

export default function ContactItem({ contact, isActive, onClick }) {
    const { name, photo, lastMessage, lastMessageTime } = contact;

    return (
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: isActive ? '#d0e6ff' : 'transparent',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <img
                    src={photo}
                    alt={name}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        marginRight: 10,
                        objectFit: 'cover',
                    }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {name}
                    </div>
                    <div
                        style={{
                            color: '#555',
                            fontSize: '0.9em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                        }}
                        title={lastMessage}
                    >
                        {lastMessage || 'Sin mensajes aún'}
                    </div>
                </div>
            </div>
            <div
                style={{
                    marginLeft: 10,
                    fontSize: '0.8em',
                    color: '#888',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}
            >
                {formatTime(lastMessageTime)}
            </div>
        </div>
    );
}
