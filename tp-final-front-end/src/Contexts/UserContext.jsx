// src/Contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import THEMES from '../Themes/themes.js';

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

function applyTheme(theme) {
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(THEMES.default);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const savedThemeKey = localStorage.getItem('selectedTheme') || 'default';

    if (savedUser) setUser(savedUser);
    if (savedContacts.length) setContacts(savedContacts);
    if (THEMES[savedThemeKey]) {
      setTheme(THEMES[savedThemeKey]);
      applyTheme(THEMES[savedThemeKey]);
    } else {
      applyTheme(THEMES.default);
    }
  }, []);

  const saveUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('loggedUser', JSON.stringify(newUser));
  };

  const saveContacts = (newContacts) => {
    setContacts(newContacts);
    localStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  const addContact = (contact) => {
    const newContacts = [...contacts, contact];
    saveContacts(newContacts);
  };

  const removeContact = (contactId) => {
    const newContacts = contacts.filter(c => c.id !== contactId);
    saveContacts(newContacts);
  };

  const login = (userData) => {
    saveUser({
      ...userData,
      color: userData.color || '#1976d2',
      blocked: userData.blocked || [],
      favorites: userData.favorites || [],
      pinned: userData.pinned || [],
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedUser');
  };

  const updateName = (newName) => {
    if (!user) return;
    saveUser({ ...user, name: newName });
  };

  const updatePhoto = (newPhoto) => {
    if (!user) return;
    saveUser({ ...user, photo: newPhoto });
  };

  const updateColor = (newColor) => {
    if (!user) return;
    saveUser({ ...user, color: newColor });
  };

  const blockContact = (contactId) => {
    if (!user) return;
    const updatedBlocked = [...(user.blocked || []), contactId];
    saveUser({ ...user, blocked: updatedBlocked });
  };

  const unblockContact = (contactId) => {
    if (!user) return;
    const updatedBlocked = (user.blocked || []).filter(id => id !== contactId);
    saveUser({ ...user, blocked: updatedBlocked });
  };

  const pinChat = (contactId) => {
    if (!user) return;
    if (user.pinned?.includes(contactId)) return;
    saveUser({ ...user, pinned: [...(user.pinned || []), contactId] });
  };

  const unpinChat = (contactId) => {
    if (!user) return;
    const updatedPinned = (user.pinned || []).filter(id => id !== contactId);
    saveUser({ ...user, pinned: updatedPinned });
  };

  const changeTheme = (themeKey) => {
    if (THEMES[themeKey]) {
      setTheme(THEMES[themeKey]);
      applyTheme(THEMES[themeKey]);
      localStorage.setItem('selectedTheme', themeKey);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateName,
      updatePhoto,
      updateColor,
      blockContact,
      unblockContact,
      pinChat,
      unpinChat,
      theme,
      changeTheme,
      contacts,
      addContact,
      removeContact,
    }}>
      {children}
    </UserContext.Provider>
  );
}
