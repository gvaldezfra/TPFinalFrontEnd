// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext.jsx';
import './login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        const user = existingUsers.find(
            (user) => user.email === email && user.password === password
        );

        if (!user) {
            alert('Email o contraseña incorrectos.');
            return;
        }

        // Guardar usuario logueado (puede ser para uso posterior)
        login(user);
        navigate('/chat'); // Cambia por la ruta que quieras para el chat o página principal
    };

    return (
        <div>
            <h1>Ingresá y empezá a chatear</h1>
            <form onSubmit={handleLogin}>
                <input
                    className="input-login"
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="input-login"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar sesión</button>
            </form>
            <p>
                ¿No tenés cuenta?{' '}
                <Link to="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Registrate acá
                </Link>
            </p>
            
            <Link to="/">
                <button>Volver al inicio</button>
            </Link>
        </div>
    );
}
