import React, { useContext, useState, useMemo } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import ContactsList from '../Components/Contacts/ContactList.jsx';
import Chat from '../Components/Chat/Chat.jsx';
import Logout from '../Components/Login/Logout.jsx';
import './styles/ChatScreen.css';

export default function ChatScreen() {
    const { messagesByContact, sendMessage } = useContext(MessageContext);

    const [contacts] = useState([
        { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1' },
        { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2' },
    ]);

    const [activeContactId, setActiveContactId] = useState(contacts[0]?.id || null);

    const contactsWithLastMessage = useMemo(() => {
        return contacts.map(contact => {
            const messages = messagesByContact[contact.id] || [];
            const lastMsg = messages[messages.length - 1];
            return {
                ...contact,
                lastMessage: lastMsg?.text,
                lastMessageTime: lastMsg?.timestamp,
            };
        });
    }, [contacts, messagesByContact]);

    const messages = messagesByContact[activeContactId] || [];

    return (
        <div className="chat-screen">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="logo">ChatApp</span>
                    <button className="add-contact">＋</button>
                </div>

                <ContactsList
                    contacts={contactsWithLastMessage}
                    activeContactId={activeContactId}
                    onSelect={setActiveContactId}
                />

                <div className="sidebar-footer">⚙️</div>
            </div>

            {/* Chat Panel */}
            <div className="chat-panel">
                <div className="chat-header">
                    <img src={activeContactId?.photo} alt={activeContactId?.name} />
                    <span>{activeContactId?.name}</span>
                </div>

                <Chat
                    contact={activeContactId}
                    messages={messages}
                    onSendMessage={(text) => sendMessage(activeContactId, text)}
                />
            </div>
        </div>
    );
}
