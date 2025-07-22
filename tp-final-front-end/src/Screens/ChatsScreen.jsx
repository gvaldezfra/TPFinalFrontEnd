// src/Screens/ChatsScreen.jsx
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import { useUser } from '../Contexts/UserContext.jsx';

import ContactsList from '../Components/Contacts/ContactList.jsx';
import ContactDetailsSidebar from '../Components/Contacts/ContactDetailsSidebar.jsx';
import Chat from '../Components/Chat/Chat.jsx';
import SettingsSidebar from '../Components/Settings/SettingsPanel.jsx';
import NewChatPanel from '../Components/Chat/NewChatPanel.jsx';
import EditProfile from '../Components/Settings/EditProfile.jsx';

import './styles/chatScreen.css';

export default function ChatScreen() {
  const { messagesByContact, sendMessage, clearMessages, deleteMessage } = useContext(MessageContext);
  const {
    user,
    pinChat,
    unpinChat,
    addContact,
  } = useUser();

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2' },
  ]);

  const [activeContactId, setActiveContactId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [showNewChatPanel, setShowNewChatPanel] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recientes');

  useEffect(() => {
    if (contacts.length && !activeContactId) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  const contactsWithLastMessage = useMemo(() => {
    if (!user) return contacts;

    const enriched = contacts.map(contact => {
      const messages = messagesByContact[contact.id] || [];
      const lastMsg = messages[messages.length - 1];

      return {
        ...contact,
        lastMessage: lastMsg?.text,
        lastMessageTime: lastMsg?.timestamp,
        isFavorite: user.favorites?.includes(contact.id) ?? false,
        isPinned: user.pinned?.includes(contact.id) ?? false,
      };
    });

    let filtered = enriched;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term)
      );
    }

    if (sortOption === 'alfabetico') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'recientes') {
      filtered.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
    }

    const pinned = filtered.filter(c => c.isPinned);
    const others = filtered.filter(c => !c.isPinned);

    return [...pinned, ...others];
  }, [contacts, messagesByContact, user, searchTerm, sortOption]);

  const messages = messagesByContact[activeContactId] || [];
  const activeContactFull = contacts.find(c => c.id === activeContactId);
  const activeContact = contactsWithLastMessage.find(c => c.id === activeContactId) || activeContactFull;

  const { theme } = useUser();

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  // useEffect(() => {
  //   const activeStillVisible = contactsWithLastMessage.some(c => c.id === activeContactId);
  //   if (!activeStillVisible) {
  //     const nextContact = contactsWithLastMessage.find(c => c.id !== activeContactId);
  //     setActiveContactId(nextContact ? nextContact.id : null);
  //   }
  // }, [contactsWithLastMessage, activeContactId]);

  const handleContactAction = (action, contact) => {
    switch (action) {
      case 'Fijar':
        setContacts(prev => [contact, ...prev.filter(c => c.id !== contact.id)]);
        break;
      case 'Vaciar':
        clearMessages(contact.id);
        break;
      case 'Eliminar':
        setContacts(prev => prev.filter(c => c.id !== contact.id));
        break;
      default:
        break;
    }
  };

  return (
    <div className="chat-screen">
      <div className="navbar">
        <button className="profile-button" onClick={() => {
          setShowEditProfile(true);
          setShowSettings(false);
          setShowNewChatPanel(false);
        }}>👤</button>
        <button className="settings-button" onClick={() => {
          setShowSettings(true);
          setShowEditProfile(false);
          setShowNewChatPanel(false);
        }}>⚙️</button>
      </div>

      <div className="sidebar">
        {showSettings && (
          <SettingsSidebar onClose={() => setShowSettings(false)} />
        )}

        {showEditProfile && (
          <EditProfile onClose={() => setShowEditProfile(false)} />
        )}

        {showNewChatPanel && (
          <NewChatPanel
            visible={true}
            contacts={contactsWithLastMessage}
            activeContactId={activeContactId}
            onSelect={setActiveContactId}
            onAddContact={(newContact) => {
              addContact({
                ...newContact,
                id: Date.now().toString(),
                photo: 'https://i.pravatar.cc/150'
              });
              setShowNewChatPanel(false);
            }}
            onClose={() => setShowNewChatPanel(false)}
          />
        )}

        {!showSettings && !showEditProfile && !showNewChatPanel && (
          <>
            <div className="sidebar-header">
              <span className="logo">ChatApp</span>
              <button
                className="new-chat-button"
                onClick={() => {
                  setShowNewChatPanel(true);
                  setShowEditProfile(false);
                  setShowSettings(false);
                }}
              >
                ➕
              </button>
            </div>
            <div className="chat-toolbar">
              <input
                type="text"
                placeholder="buscar chats o iniciar nuevo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="chat-search-input"
              />
              <div className="chat-toolbar-buttons">
                <button onClick={() => setSortOption('recientes')}>recientes</button>
                <button onClick={() => setSortOption('alfabetico')}>a - z</button>
              </div>
            </div>
            <ContactsList
              contacts={contactsWithLastMessage}
              activeContactId={activeContactId}
              onSelect={setActiveContactId}
              onAction={handleContactAction}
            />
          </>
        )}
      </div>

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
          contact={activeContactFull}
          messages={messages}
          onSendMessage={(text) => sendMessage(activeContactId, text)}
          onDeleteMessage={deleteMessage}
        />
      </div>

      {showContactDetail && (
        <div className="contact-details-sidebar">
          <ContactDetailsSidebar
            contact={activeContact}
            onClose={() => setShowContactDetail(false)}
          />
        </div>
      )}
    </div>
  );
}
