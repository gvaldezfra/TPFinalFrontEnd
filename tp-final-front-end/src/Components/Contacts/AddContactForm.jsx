import React, { useState } from 'react';
import './styles/AddContactForm.css';

export default function AddContactForm({ onAdd, onCancel }) {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !number.trim()) return;

        onAdd({ name, number });
        setName('');
        setNumber('');
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
                type="tel"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
            />
            <div className="add-contact-actions">
                <button type="submit">Agregar</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
}
