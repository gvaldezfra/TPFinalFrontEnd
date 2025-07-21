// src/Contexts/UserContext.jsx
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
      pinned: userData.pinned || [],
      archived: userData.archived || [],
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

  const archiveChat = (contactId) => {
    if (!user) return;
    if (user.archived?.includes(contactId)) return;
    saveUser({ ...user, archived: [...(user.archived || []), contactId] });
  };

  const unarchiveChat = (contactId) => {
    if (!user) return;
    const updatedArchived = (user.archived || []).filter(id => id !== contactId);
    saveUser({ ...user, archived: updatedArchived });
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
      archiveChat,
      unarchiveChat,
    }}>
      {children}
    </UserContext.Provider>
  );
}
