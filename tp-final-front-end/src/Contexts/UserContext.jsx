import { createContext, useContext, useState, useEffect } from 'react';
import THEMES from '../Themes/themes.js';

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const initialContacts = [
  { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1', email: 'ana@mail.com' },
  { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2', email: 'juan@mail.com' },
];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const [contacts, setContacts] = useState(() => {
    const stored = sessionStorage.getItem('contacts');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialContacts;
      }
    }
    return initialContacts;
  });

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    const stored = sessionStorage.getItem('loggedUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.color || !THEMES[parsed.color]) {
          parsed.color = 'default';
        }
        setUser(parsed);
      } catch (err) {
        console.warn('Error al parsear loggedUser:', err);
      }
    }
  }, []);

  useEffect(() => {
    const storedThemeKey = sessionStorage.getItem('selectedTheme');
    if (storedThemeKey && THEMES[storedThemeKey]) {
      setTheme(THEMES[storedThemeKey]);
      Object.entries(THEMES[storedThemeKey]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    } else if (user?.color && THEMES[user.color]) {
      setTheme(THEMES[user.color]);
      Object.entries(THEMES[user.color]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    } else {
      setTheme(THEMES.default);
      Object.entries(THEMES.default).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [user]);

  const saveUser = (newUser) => {
    setUser(newUser);
    sessionStorage.setItem('loggedUser', JSON.stringify(newUser));
  };

  const login = (userData) => {
    if (!userData.color || !THEMES[userData.color]) userData.color = 'default';
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('loggedUser');
  };

  const updateName = (newName) => {
    if (!user) return;
    saveUser({ ...user, name: newName });
  };

  const updatePhoto = (newPhoto) => {
    if (!user) return;
    saveUser({ ...user, photo: newPhoto });
  };

  const updateColor = (newColorKey) => {
    if (!user) return;
    if (!THEMES[newColorKey]) return;
    saveUser({ ...user, color: newColorKey });
    setTheme(THEMES[newColorKey]);
    Object.entries(THEMES[newColorKey]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    sessionStorage.setItem('selectedTheme', newColorKey);
  };

  const addContact = (newContact) => {
    setContacts((prev) => {
      const exists = prev.some(c => c.email === newContact.email);
      if (exists) return prev; 
      return [...prev, newContact];
    });
  };

  const editContact = (updatedContact) => {
    setContacts(prev =>
      prev.map(c => (c.id === updatedContact.id ? { ...c, ...updatedContact } : c))
    );
  };

  const deleteContact = (contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        theme,
        contacts,
        login,
        logout,
        updateName,
        updatePhoto,
        updateColor,
        setTheme,
        addContact,
        editContact,
        deleteContact,
        setContacts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
