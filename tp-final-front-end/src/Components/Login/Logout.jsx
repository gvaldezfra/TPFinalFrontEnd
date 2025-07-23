import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>
      Cerrar sesión
    </button>
  );
}
