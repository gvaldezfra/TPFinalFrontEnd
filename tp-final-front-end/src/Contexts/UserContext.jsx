import { createContext, useContext, useState, useEffect } from 'react';

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (savedUser) setUser(savedUser);
  }, []);

  const saveUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('loggedUser', JSON.stringify(newUser));
  };

  const login = (userData) => {
    saveUser({
      ...userData,
      color: userData.color || '#1976d2',
      blocked: userData.blocked || [],
      favorites: userData.favorites || [],
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

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateName,
      updatePhoto,
      updateColor,
      blockContact,
      unblockContact
    }}>
      {children}
    </UserContext.Provider>
  );
}
