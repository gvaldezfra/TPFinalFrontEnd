import React, { useContext, useState, useMemo } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import ContactsList from '../Components/Contacts/ContactList.jsx';
import Chat from '../Components/Chat/Chat.jsx';
import Logout from '../Components/Login/Logout.jsx';
import './styles/ChatScreen.css';
import AddContactForm from '../Components/Contacts/AddContactForm.jsx';

export default function ChatScreen() {
    const { messagesByContact, sendMessage } = useContext(MessageContext);

    const [contacts, setContacts] = useState([
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

    const [showAddForm, setShowAddForm] = useState(false);

    const activeContact = contactsWithLastMessage.find(c => c.id === activeContactId);


    return (
        <div className="chat-screen">
            {/* Navbar */}
            <div className="navbar">
                <button className='search-button'>🔍</button>
                <button className='profile-button'>👤</button>
                <button className='settings-button'>⚙️</button>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="logo">ChatApp</span>
                    <button
                        className="add-contact"
                        onClick={() => setShowAddForm(true)}
                    >➕</button>
                </div>

                {showAddForm ? (
                    <AddContactForm
                        onAdd={(newContact) => {
                            setContacts(prev => [...prev, { ...newContact, id: Date.now().toString(), photo: 'https://i.pravatar.cc/150' }]);
                            setShowAddForm(false);
                        }}
                        onCancel={() => setShowAddForm(false)}
                    />
                ) : (
                    <ContactsList
                        contacts={contactsWithLastMessage}
                        activeContactId={activeContactId}
                        onSelect={setActiveContactId}
                    />
                )}
            </div>

            {/* Chat Panel */}
            <div className="chat-panel">
                <div className="chat-header">
                    <img src={activeContact.photo} alt={activeContact.name} />
                    <span>{activeContact.name}</span>
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
