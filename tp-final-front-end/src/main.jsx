import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Login from './Components/Login/Login.jsx';
import Register from './Components/Register/Register.jsx';
import { UserProvider } from './Contexts/UserContext.jsx';
import MessageProvider from './Contexts/MessageContext.jsx';
import ChatScreen from './Screens/ChatsScreen.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <MessageProvider> {/* ✅ esto también */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatScreen />} />
        </Routes>
      </BrowserRouter>
    </MessageProvider>
  </UserProvider>
);
