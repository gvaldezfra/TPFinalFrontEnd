// src/Components/LoadingScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/loadingScreen.css';

export default function LoadingScreen({ delay = 1500 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/chat');
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, delay]);

  return (
    <div className="loading-screen">
      <div className="loading-bar"></div>
      <p className="loading-text">Cargando...</p>
    </div>
  );
}
