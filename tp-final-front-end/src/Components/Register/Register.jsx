import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            alert('Todos los campos son obligatorios');
            return;
        }

        // Leer usuarios ya guardados
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el email ya existe
        const emailRepetido = existingUsers.find(user => user.email === email);

        if (emailRepetido) {
            alert('Este email ya está registrado. Usá otro.');
            return;
        }

        // Agregar nuevo usuario
        const newUser = { name, email, password };
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        alert('Registro exitoso. Iniciá sesión.');
        navigate('/login');
    };

    return (
        <div>
            <h1>Registrate</h1>
            <form onSubmit={handleRegister}>
                {/* Inputs */}
                <input
                    className="input-login"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit">Registrarse</button>
            </form>

            {/* Enlace para volver al login */}
            <p>
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Iniciá sesión acá
                </Link>
            </p>
            <Link to="/">
                <button>Volver al inicio</button>
            </Link>
        </div>
    );
}

