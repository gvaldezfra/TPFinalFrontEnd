import React from 'react';
import './index.css';
import THEMES from './Themes/themes.js';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const theme = THEMES.default;

    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  return (
    <div>
      <h1>Bienvenido a ChattApp</h1>
      <a href="/login">Ingresar o Registrarse</a>
    </div>
  );
}
