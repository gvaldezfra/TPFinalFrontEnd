import React from 'react';
import { useUser } from '../../Contexts/UserContext.jsx';
import THEMES from '../../Themes/themes.js';
import './settingsPanel.css';

export default function SettingsSidebar({ onClose }) {
  const { updateColor, logout, user } = useUser();

  const handleThemeChange = (themeKey) => {
    if (!THEMES[themeKey]) return;

    updateColor(themeKey);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="settings-sidebar">
      <h2>Temas de color</h2>

      <div className="theme-buttons-container">
        {Object.entries(THEMES).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => handleThemeChange(key)}
            className="theme-button"
            style={{
              backgroundColor: theme['--chat-header'],
              color: theme['--text-color'],
              border: user?.color === key ? '2px solid black' : 'none',
            }}
            title={key}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <button onClick={handleLogout} className="logout">Cerrar sesión</button>
      <button onClick={onClose} className="close">Cerrar panel</button>
    </div>
  );
}
