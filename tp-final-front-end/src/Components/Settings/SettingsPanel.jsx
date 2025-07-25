import React from 'react';
import { useUser } from '../../Contexts/UserContext.jsx';
import THEMES from '../../Themes/themes.js';
import './settingsPanel.css';

const baseColors = ['default', 'blue', 'green', 'red', 'purple']; 

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
      <button onClick={onClose} className="close-button">X</button>
      <h2>Personalizar</h2>
      <p>Elige un tema para tu chat:</p>

      <div className="theme-buttons-container">
        {baseColors.map(color => (
          <div key={color} className="theme-row">
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </span>

            {/* Botón Light */}
            <button
              onClick={() => handleThemeChange(color + 'Light')}
              className="theme-button"
              style={{
                backgroundColor: THEMES[color + 'Light']['--header-bg'],
                color: THEMES[color + 'Light']['--text-color'],
                border: user?.color === color + 'Light' ? '2px solid black' : 'none',
                marginRight: '5px',
              }}
              title={`${color} Light`}
            >
              Light
            </button>

            {/* Botón Dark */}
            <button
              onClick={() => handleThemeChange(color + 'Dark')}
              className="theme-button"
              style={{
                backgroundColor: THEMES[color + 'Dark']['--header-bg'],
                color: THEMES[color + 'Dark']['--text-color'],
                border: user?.color === color + 'Dark' ? '2px solid black' : 'none',
              }}
              title={`${color} Dark`}
            >
              Dark
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleLogout} className="logout">Cerrar sesión</button>
    </div>
  );
}
