
import React, { useState, useEffect } from 'react';
import ContactsList from '../Components/Contacts/ContactList.jsx';
import ContactDetailsSidebar from '../Components/Contacts/ContactDetailsSidebar.jsx';
import Chat from '../Components/Chat/Chat.jsx';
import SettingsSidebar from '../Components/Settings/SettingsPanel.jsx';
import NewChatPanel from '../Components/Chat/NewChatPanel.jsx';
import EditProfile from '../Components/Settings/EditProfile.jsx';
import { RiChatNewLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { GiHamburgerMenu } from 'react-icons/gi';

import useChatScreen from '../hooks/useChatScreen.js';

import './styles/chatScreen.css';

export default function ChatScreen() {
  const {
    user,
    loading,
    contactsWithLastMessage,
    activeContactId,
    setActiveContactId,
    showSettings,
    setShowSettings,
    showContactDetail,
    setShowContactDetail,
    showNewChatPanel,
    setShowNewChatPanel,
    showEditProfile,
    setShowEditProfile,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    messages,
    activeContact,
    sendMessage,
    deleteMessage,
    addContact,
    handleContactAction,
  } = useChatScreen();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 780);
  const [showMobileSidebar, setShowMobileSidebar] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 780);
      if (window.innerWidth >= 780) {
        setShowMobileSidebar(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className={`chat-screen ${isMobile && !showMobileSidebar ? 'mobile-show-chat' : ''}`}>
      {isMobile && (
        <button className="hamburger-button" onClick={() => setShowMobileSidebar(!showMobileSidebar)}>
          <GiHamburgerMenu size={24} />
        </button>
      )}

      <div className="navbar">
        <button className="profile-button" onClick={() => {
          setShowEditProfile(true);
          setShowSettings(false);
          setShowNewChatPanel(false);
        }}>
          <CgProfile size={30} />
        </button>
        <button className="settings-button" onClick={() => {
          setShowSettings(true);
          setShowEditProfile(false);
          setShowNewChatPanel(false);
        }}>
          <IoSettingsOutline size={30} />
        </button>
      </div>

      {(!isMobile || (isMobile && showMobileSidebar)) && (
        <div className="sidebar">
          {showSettings && <SettingsSidebar onClose={() => setShowSettings(false)} />}
          {showEditProfile && <EditProfile onClose={() => setShowEditProfile(false)} />}
          {showNewChatPanel && (
            <NewChatPanel
              visible={true}
              contacts={contactsWithLastMessage}
              activeContactId={activeContactId}
              onSelect={setActiveContactId}
              onAddContact={(newContact) => {
                addContact({ ...newContact, id: Date.now().toString(), photo: 'https://i.pravatar.cc/150' });
                setShowNewChatPanel(false);
              }}
              onClose={() => setShowNewChatPanel(false)}
            />
          )}

          {!showSettings && !showEditProfile && !showNewChatPanel && (
            <>
              <div className="sidebar-header">
                <span className="logo">ChatApp</span>
                <button className="new-chat-button" onClick={() => {
                  setShowNewChatPanel(true);
                  setShowEditProfile(false);
                  setShowSettings(false);
                }}>
                  <RiChatNewLine size={30} />
                </button>
              </div>
              <div className="chat-toolbar">
                <input
                  type="text"
                  placeholder="Buscar chat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="chat-search-input"
                />
                <div className="chat-toolbar-buttons">
                  <button onClick={() => setSortOption('alfabetico')}>A - Z</button>
                  <button onClick={() => setSortOption('recientes')}>Recientes</button>
                </div>
              </div>
              <ContactsList
                contacts={contactsWithLastMessage}
                activeContactId={activeContactId}
                onSelect={(id) => {
                  setActiveContactId(id);
                  if (isMobile) setShowMobileSidebar(false);
                }}
                onAction={handleContactAction}
              />

            </>
          )}
        </div>
      )}

      {(!isMobile || (isMobile && !showMobileSidebar)) && (
        <div className="chat-panel">
          <div className="chat-header">
            <img src={activeContact?.photo} alt={activeContact?.name || ''} />
            <span style={{ cursor: 'pointer' }} onClick={() => setShowContactDetail(true)}>
              {activeContact?.name || 'Sin contacto activo'}
            </span>
          </div>

          <Chat
            contact={activeContact}
            messages={messages}
            onSendMessage={(content) => sendMessage(activeContactId, content)}
            onDeleteMessage={deleteMessage}
          />
        </div>
      )}

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
