// src/Screens/HomeScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/homeScreen.css';
import { motion } from 'framer-motion';

export default function HomeScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <motion.div 
    className="home-screen"
    initial={{ opacity: 0, y: 50}}
    animate={{ opacity: 1, y:0 }}
    transition={{ duration: 0.6 }}
    >
      <h1 className="home-title">ChattApp ©</h1>
      <button className="start-button" onClick={handleStart}>
        ¿Empezamos?
      </button>
        <p className="home-description">
            ChattApp es una aplicación de mensajería instantánea que te permite
            comunicarte con tus amigos y familiares de manera rápida y sencilla.
        </p>
    </motion.div>
  );
}
