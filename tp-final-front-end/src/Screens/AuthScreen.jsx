import React, { useState } from 'react';
import Login from '../Components/Login/Login.jsx';
import Register from '../Components/Register/Register.jsx';
import './styles/authScreen.css';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-screen">

      <div className="tab-content">
        {activeTab === 'login' && <Login />}
        {activeTab === 'register' && <Register />}
      </div>

      {activeTab === 'login' && (
        <div className="switch-to-container">
          <p>¿No tenés cuenta?</p>
          <button
            className="switch-to-button"
            onClick={() => setActiveTab('register')}>
            Registrate acá
          </button>
        </div>
      )}

      {activeTab === 'register' && (
        <div className="switch-to-container">
          <p>¿Ya tenés cuenta?</p>
          <button
            className="switch-to-button"
            onClick={() => setActiveTab('login')}>
            Iniciá sesión acá
          </button>
        </div>
      )}
    </div>
  );
}
