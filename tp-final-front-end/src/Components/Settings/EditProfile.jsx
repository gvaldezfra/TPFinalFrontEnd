// src/Components/Settings/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../Contexts/UserContext.jsx';
import './editProfile.css';
import defaultAvatar from '../../assets/avatargris.png';

export default function EditProfile({ onClose }) {
  const { user, updateName, updatePhoto } = useUser();

  const [name, setName] = useState(user?.name || '');
  const [photoPreview, setPhotoPreview] = useState(user?.photo || defaultAvatar);
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (name.trim() !== '') {
      updateName(name.trim());
    }
    if (photoPreview && photoPreview !== user.photo) {
      updatePhoto(photoPreview);
    }
    onClose();
  };

  return (
    <div className="edit-profile-panel">
      <h2>Editar perfil</h2>

      <div className="edit-profile-photo">
        <img src={photoPreview} alt="Foto de perfil" />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          id="photoInput"
          style={{ display: 'none' }}
        />
        <button onClick={() => document.getElementById('photoInput').click()}>
          Cambiar foto
        </button>
      </div>

      <div className="edit-profile-name">
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div className="edit-profile-actions">
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
