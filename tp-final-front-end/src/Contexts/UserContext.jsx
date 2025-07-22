import { createContext, useContext, useState, useEffect } from 'react';
import THEMES from '../Themes/themes.js'; // ruta relativa, ajusta si hace falta

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem('loggedUser');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.color || !THEMES[parsed.color]) {
          parsed.color = 'default'; // fallback a tema 'default' si no existe
        }
        setUser(parsed);
      } catch (err) {
        console.warn('Error al parsear loggedUser:', err);
      }
    }
  }, []);

  // Cargar tema desde localStorage o fallback según user.color
  useEffect(() => {
    const storedThemeKey = localStorage.getItem('selectedTheme');
    if (storedThemeKey && THEMES[storedThemeKey]) {
      setTheme(THEMES[storedThemeKey]);
      // Aplicar variables CSS
      Object.entries(THEMES[storedThemeKey]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    } else if (user?.color && THEMES[user.color]) {
      setTheme(THEMES[user.color]);
      Object.entries(THEMES[user.color]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    } else {
      // Si no hay tema guardado, cargamos el default
      setTheme(THEMES.default);
      Object.entries(THEMES.default).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [user]);

  // Guardar user y persistir
  const saveUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('loggedUser', JSON.stringify(newUser));
  };

  const login = (userData) => {
    if (!userData.color || !THEMES[userData.color]) userData.color = 'default';
    saveUser(userData);
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

  const updateColor = (newColorKey) => {
    if (!user) return;
    if (!THEMES[newColorKey]) return; // validar que exista el tema
    saveUser({ ...user, color: newColorKey });
    setTheme(THEMES[newColorKey]);
    // Aplicar variables CSS
    Object.entries(THEMES[newColorKey]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('selectedTheme', newColorKey);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        theme,
        login,
        logout,
        updateName,
        updatePhoto,
        updateColor,
        setTheme,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
