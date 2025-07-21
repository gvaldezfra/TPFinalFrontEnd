// src/Screens/ChatsScreen.jsx
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import { UserContext } from '../Contexts/UserContext.jsx';

import ContactsList from '../Components/Contacts/ContactList.jsx';
import ContactDetailsSidebar from '../Components/Contacts/ContactDetailsSidebar.jsx';
import Chat from '../Components/Chat/Chat.jsx';
import SettingsSidebar from '../Components/Settings/SettingsPanel.jsx';
import NewChatPanel from '../Components/Chat/NewChatPanel.jsx';
import ContextMenu from '../Components/Contacts/ContextMenu.jsx';

import './styles/ChatScreen.css';

export default function ChatScreen() {
  const { messagesByContact, sendMessage, clearMessages } = useContext(MessageContext);
  const { user } = useContext(UserContext);

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2' },
  ]);

  const [activeContactId, setActiveContactId] = useState(contacts[0]?.id || null);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [showNewChatPanel, setShowNewChatPanel] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, contact }

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

  const handleContextMenu = (e, contact) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      contact
    });
  };

  const handleContextMenuAction = (action) => {
    const contact = contextMenu?.contact;
    if (!contact) return;

    switch (action) {
      case 'Fijar chat':
        setContacts(prev =>
          [contact, ...prev.filter(c => c.id !== contact.id)]
        );
        break;
      case 'Vaciar chat':
        clearMessages(contact.id);
        break;
      case 'Eliminar':
        setContacts(prev => prev.filter(c => c.id !== contact.id));
        break;
      case 'Archivar':
        setContacts(prev =>
          prev.map(c =>
            c.id === contact.id ? { ...c, archived: true } : c
          )
        );
        break;
      default:
        break;
    }

    setContextMenu(null);
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

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
              setShowNewChatPanel(false);
            }}
            onClose={() => setShowNewChatPanel(false)}
          />
        ) : (
          <>
            <div className="sidebar-header">
              <span className="logo">ChatApp</span>
              <button
                className="new-chat-button"
                onClick={() => setShowNewChatPanel(true)}
              >
                ➕
              </button>
            </div>

            <ContactsList
              contacts={contactsWithLastMessage}
              activeContactId={activeContactId}
              onSelect={setActiveContactId}
              onContextMenu={handleContextMenu}
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

      {/* Contact Details */}
      {showContactDetail && (
        <div className="contact-details-sidebar">
          <ContactDetailsSidebar
            contact={activeContact}
            onClose={() => setShowContactDetail(false)}
          />
        </div>
      )}

      {/* Context Menu */}
      <ContextMenu
        position={contextMenu}
        onClose={() => setContextMenu(null)}
        onAction={handleContextMenuAction}
      />
    </div>
  );
}
