import React, { useContext, useState, useMemo } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import { UserContext } from '../Contexts/UserContext.jsx';

import ContactsList from '../Components/Contacts/ContactList.jsx';
import ContactDetailsSidebar from '../Components/Contacts/ContactDetailsSidebar.jsx';
import Chat from '../Components/Chat/Chat.jsx';
import SettingsSidebar from '../Components/Settings/SettingsPanel.jsx';
import NewChatPanel from '../Components/Chat/NewChatPanel.jsx';
import './styles/ChatScreen.css';

export default function ChatScreen() {
  const { messagesByContact, sendMessage } = useContext(MessageContext);
  const { user } = useContext(UserContext);

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2' },
  ]);

  const [activeContactId, setActiveContactId] = useState(contacts[0]?.id || null);
  const [showSettings, setShowSettings] = useState(false);

  const contactsWithLastMessage = useMemo(() => {
    if (!user) return contacts.map(contact => ({
      ...contact,
      lastMessage: undefined,
      lastMessageTime: undefined,
      isFavorite: false,
    }));

    return contacts.map(contact => {
      const messages = messagesByContact[contact.id] || [];
      const lastMsg = messages[messages.length - 1];
      return {
        ...contact,
        lastMessage: lastMsg?.text,
        lastMessageTime: lastMsg?.timestamp,
        isFavorite: user.favorites?.includes(contact.id) ?? false,
      };
    });
  }, [contacts, messagesByContact, user]);

  const messages = messagesByContact[activeContactId] || [];
  const activeContact = contactsWithLastMessage.find(c => c.id === activeContactId);
  const [showContactDetail, setShowContactDetail] = React.useState(false);
  const [showNewChatPanel, setShowNewChatPanel] = useState(false);

  return (
    <div className="chat-screen">
      {/* Navbar */}
      <div className="navbar">
        <button className="search-button">🔍</button>
        <button className="profile-button">👤</button>
        <button className="settings-button" onClick={() => setShowSettings(true)}>⚙️</button>
      </div>

      {/* Sidebar */}
    <div className="sidebar">
        {showSettings ? (
            <SettingsSidebar onClose={() => setShowSettings(false)} />
        ) : showNewChatPanel ? (
            <NewChatPanel
                visible={true}
                contacts={contactsWithLastMessage}
                activeContactId={activeContactId}
                onSelect={setActiveContactId}
                onAddContact={(newContact) => {
                    setContacts(prev => [
                        ...prev,
                        {
                            ...newContact,
                            id: Date.now().toString(),
                            photo: 'https://i.pravatar.cc/150'
                        }
                    ]);
                    setShowNewChatPanel(false); // opcional: cerrarlo al agregar
                }}
                onClose={() => setShowNewChatPanel(false)} // si lo usás
            />
        ) : (
            <>
                <div className="sidebar-header">
                    <span className="logo">ChatApp</span>
                    <button
                        className="add-contact"
                        onClick={() => setShowNewChatPanel(true)}
                    >
                        ➕
                    </button>
                </div>

                <ContactsList
                    contacts={contactsWithLastMessage}
                    activeContactId={activeContactId}
                    onSelect={setActiveContactId}
                />
            </>
        )}
    </div>
      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-header">
            <img src={activeContact?.photo} alt={activeContact?.name || ''} />
            <span
                style={{ cursor: 'pointer' }}
                onClick={() => setShowContactDetail(true)}
            >
                {activeContact?.name || 'Sin contacto activo'}
            </span>
        </div>

        <Chat
          contact={activeContactId}
          messages={messages}
          onSendMessage={(text) => sendMessage(activeContactId, text)}
        />
      </div>
    {/* Contact Details*/}
    {showContactDetail && (
        <ContactDetailsSidebar
            contact={activeContact}
            onClose={() => setShowContactDetail(false)}
        />
    )}
    </div>
  );
}
