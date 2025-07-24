// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext.jsx';
import LoadingScreen from '../../Screens/LoadingScreen.jsx';
import { motion } from 'framer-motion';
import './register.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser(); 

    const handleRegister = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (password !== repeatPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const existingUsers = JSON.parse(sessionStorage.getItem('users')) || [];
        const emailRepetido = existingUsers.find(user => user.email === email);

        if (emailRepetido) {
            setError('Este email ya está registrado. Usá otro.');
            return;
        }

        const newUser = {
            name,
            email,
            password,
            photo: '',           
            color: 'default',
            favorites: [],
            blocked: [],
            pinned: [],
        };

        const updatedUsers = [...existingUsers, newUser];
        sessionStorage.setItem('users', JSON.stringify(updatedUsers));

        setLoading(true);

        setTimeout(() => {
            login(newUser); 
            setError('');
            navigate('/chat');
        }, 1500);
    };

    if (loading) return <LoadingScreen />;

    return (
        <motion.div
            className="register-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <motion.h1
                className="app-title"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                ChattApp ©
            </motion.h1>

            <motion.h2
                className="register-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Registrarse
            </motion.h2>

            <motion.form
                onSubmit={handleRegister}
                className="register-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <input
                    className="register-input"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="register-input"
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="register-input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    className="register-input"
                    type="password"
                    placeholder="Repetir contraseña"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />
                <button type="submit" className="register-button">Registrarse</button>
            </motion.form>

            {error && (
                <motion.p
                    className="register-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.p>
            )}

            <motion.div
                className="register-back-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <Link to="/">
                    <motion.button
                        className="register-back-button"
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
