import { useContext, useState, useMemo, useEffect } from 'react';
import { MessageContext } from '../Contexts/MessageContext.jsx';
import { useUser } from '../Contexts/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function useChatScreen() {
  const { messagesByContact, sendMessage, clearMessages, deleteMessage } = useContext(MessageContext);
  const { user, loading, contacts, addContact, login, theme } = useUser();
  const navigate = useNavigate();

  const [activeContactId, setActiveContactId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [showNewChatPanel, setShowNewChatPanel] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recientes');

  // Protegemos contacts para que siempre sea un array
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  // Navegar a login si no hay usuario
  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  // Setear contacto activo al cargar contactos
  useEffect(() => {
    if (safeContacts.length && !activeContactId) {
      setActiveContactId(safeContacts[0].id);
    }
  }, [safeContacts, activeContactId]);

  // Aplicar tema CSS custom properties
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  // Enriquecer y filtrar contactos con último mensaje, favoritos y fijados
  const contactsWithLastMessage = useMemo(() => {
    if (!user) return safeContacts;

    const enriched = safeContacts.map(contact => {
      const messages = messagesByContact[contact.id] || [];
      const lastMsg = messages[messages.length - 1];

      let lastMessageText = '';
      if (lastMsg) {
        if (lastMsg.deleted) lastMessageText = '[mensaje eliminado]';
        else if (typeof lastMsg.text === 'string') lastMessageText = lastMsg.text;
        else if (lastMsg.text?.type === 'image') lastMessageText = '[imagen]';
        else lastMessageText = '[mensaje no soportado]';
      }

      return {
        ...contact,
        lastMessage: lastMessageText,
        lastMessageTime: lastMsg?.timestamp,
        isFavorite: user.favorites?.includes(contact.id) ?? false,
        isPinned: user.pinned?.includes(contact.id) ?? false,
      };
    });

    // Filtrado por búsqueda
    let filtered = enriched;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(term));
    }

    // Ordenamiento
    if (sortOption === 'alfabetico') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'recientes') {
      filtered.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
    }

    // Contactos fijados al inicio
    const pinnedIds = user.pinned || [];
    const pinnedContacts = pinnedIds
      .map(id => filtered.find(c => c.id === id))
      .filter(Boolean);
    const others = filtered.filter(c => !pinnedIds.includes(c.id));

    return [...pinnedContacts, ...others];
  }, [safeContacts, messagesByContact, user, searchTerm, sortOption]);

  // Contacto activo y sus mensajes
  const messages = activeContactId ? messagesByContact[activeContactId] || [] : [];
  const activeContactFull = safeContacts.find(c => c.id === activeContactId);
  const activeContact = contactsWithLastMessage.find(c => c.id === activeContactId) || activeContactFull;

  // Función para fijar o des-fijar contacto
  const togglePin = (contactId) => {
    if (!user) return;
    const pinned = user.pinned || [];
    const newPinned = pinned.includes(contactId)
      ? pinned.filter(id => id !== contactId)
      : [contactId, ...pinned];
    login({ ...user, pinned: newPinned });
  };

  // Manejar acciones en contactos
  const handleContactAction = (action, contact) => {
    switch (action) {
      case 'pin':
        togglePin(contact.id);
        break;
      case 'clear':
        clearMessages(contact.id);
        break;
      default:
        break;
    }
  };

  return {
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
  };
}
