import { createContext, useContext, useState, useEffect } from 'react';
import THEMES from '../Themes/themes.js';

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const initialContacts = [
  { id: '1', name: 'Ana', photo: 'https://i.pravatar.cc/150?img=1', email: 'ana@mail.com' },
  { id: '2', name: 'Juan', photo: 'https://i.pravatar.cc/150?img=2', email: 'juan@mail.com' },
];

// Helper para cambiar el tema de la aplicación
function applyTheme(themeObj) {
  if (!themeObj) return;
  Object.entries(themeObj).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

// Helper para parsear JSON de sessionStorage
function safeParseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contacts, setContacts] = useState(() => {
    const stored = safeParseJSON(sessionStorage.getItem('contacts'), null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      sessionStorage.setItem('contacts', JSON.stringify(initialContacts));
      return initialContacts;
    }
    return stored;
  });

  const [theme, setTheme] = useState(null);

  // Guarda contactos en sessionStorage
  useEffect(() => {
    sessionStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Si contacts queda vacío en algún momento, reestablecer iniciales
  useEffect(() => {
    if (!contacts || contacts.length === 0) {
      setContacts(initialContacts);
      sessionStorage.setItem('contacts', JSON.stringify(initialContacts));
    }
  }, [contacts]);

  // Carga el usuario desde sessionStorage al iniciar
  useEffect(() => {
    const stored = sessionStorage.getItem('loggedUser');
    if (stored) {
      const parsed = safeParseJSON(stored, null);
      if (parsed) {
        if (!parsed.color || !THEMES[parsed.color]) {
          parsed.color = 'defaultLight';
        }
        setUser(parsed);
      }
    } else {
      setUser({ color: 'defaultLight' });
    }
    setLoading(false);
  }, []);

  // Aplica el tema al cargar, color default si no hay usuario, o tema del usuario si existe
  useEffect(() => {
    const storedThemeKey = sessionStorage.getItem('selectedTheme');
    if (storedThemeKey && THEMES[storedThemeKey]) {
      setTheme(THEMES[storedThemeKey]);
      applyTheme(THEMES[storedThemeKey]);
    } else if (user?.color && THEMES[user.color]) {
      setTheme(THEMES[user.color]);
      applyTheme(THEMES[user.color]);
    } else {
      setTheme(THEMES['defaultLight']);
      applyTheme(THEMES['defaultLight']);
    }
  }, [user]);

  const saveUser = (newUser) => {
    setUser(newUser);
    sessionStorage.setItem('loggedUser', JSON.stringify(newUser));
  };

  const login = (userData) => {
    if (!userData.color || !THEMES[userData.color]) userData.color = 'defaultLight';
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
    applyTheme(THEMES[newColorKey]);
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
        loading,
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
