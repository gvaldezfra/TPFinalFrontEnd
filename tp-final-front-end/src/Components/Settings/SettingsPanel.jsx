// SettingsSidebar.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../Contexts/UserContext.jsx';
import './SettingsPanel.css'; // asumimos que el estilo está aquí

export default function SettingsSidebar({ onClose }) {
  const { user, login, logout } = useUser();

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [blocked, setBlocked] = useState([]);

  // Inicializamos los campos desde user solo después de montar
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoto(user.photo || '');
      setColor(user.color || '#1976d2');
      setBlocked(user.blocked || []);
    }
  }, [user]);

  // Evita error si no hay user
  if (!user) return null;

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      photo,
      color,
      blocked,
    };
    login(updatedUser);
    onClose();
  };

  const handleBlock = (contactId) => {
    if (!blocked.includes(contactId)) {
      setBlocked([...blocked, contactId]);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="settings-sidebar">
      <h2>Configuración</h2>

      <label>
        Nombre:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Foto de perfil (URL):
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} />
      </label>

      <label>
        Color del chat:
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>

      <button onClick={handleSave}>Guardar cambios</button>

      <h3>Bloquear contacto</h3>
      {/* Aquí podrías listar contactos para bloquear */}
      {/* <button onClick={() => handleBlock('contact-id')}>Bloquear Juan</button> */}

      <button onClick={handleLogout} className="logout">Cerrar sesión</button>
      <button onClick={onClose} className="close">Cerrar panel</button>
    </div>
  );
}
