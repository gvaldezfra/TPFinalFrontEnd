import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext.jsx'; 

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
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

        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
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
            archived: [],
        };

        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        login(newUser); 
        setError('');
        navigate('/chat');
    };

    return (
        <div>
            <h1>Registrate</h1>
            <form onSubmit={handleRegister}>
                <input className="input-login" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="input-login" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="input-login" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input className="input-login" type="password" placeholder="Repetir contraseña" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                <button type="submit">Registrarse</button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <p>
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Iniciá sesión acá
                </Link>
            </p>
            <Link to="/"><button>Volver al inicio</button></Link>
        </div>
    );
}
