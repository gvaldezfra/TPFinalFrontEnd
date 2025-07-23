import React, { useEffect } from 'react';
import './index.css';
import { useUser } from './Contexts/UserContext.jsx';
import HomeScreen from './Screens/HomeScreen.jsx';

export default function App() {
  const { user, theme, loading } = useUser();

  useEffect(() => {
    if (!theme) return;

    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <HomeScreen></HomeScreen>
    </div>
  );
}
