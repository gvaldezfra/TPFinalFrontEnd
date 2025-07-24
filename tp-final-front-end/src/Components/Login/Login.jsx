// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext.jsx';
import LoadingScreen from '../../Screens/LoadingScreen.jsx';
import { motion } from 'framer-motion'; // ✅ importar
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const existingUsers = JSON.parse(sessionStorage.getItem('users')) || [];

    const user = existingUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      alert('Email o contraseña incorrectos.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      login(user);
      navigate('/chat');
    }, 1500);
  };

  if (loading) return <LoadingScreen />;

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h1
        className="app-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ChattApp ©
      </motion.h1>

      <motion.h2
        className="login-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Iniciar sesión
      </motion.h2>

      <motion.div
        className="login-form"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-button" type="submit">
            Iniciar sesión
          </button>
        </form>

        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Volver al inicio
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
