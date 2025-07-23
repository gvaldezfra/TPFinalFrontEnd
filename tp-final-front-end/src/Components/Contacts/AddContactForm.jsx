import React, { useState } from 'react';
import './styles/addContactForm.css';

export default function AddContactForm({ onAdd, onCancel }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        onAdd({ name, email});
        setName('');
        setEmail('');
    };

    return (
        <form className="add-contact-form" onSubmit={handleSubmit}>
            <h3>Nuevo contacto</h3>
            <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className="add-contact-actions">
                <button type="submit">Agregar</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
}
