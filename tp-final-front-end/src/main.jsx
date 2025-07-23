import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import AuthScreen from './Screens/AuthScreen.jsx';
import { UserProvider } from './Contexts/UserContext.jsx';
import MessageProvider from './Contexts/MessageContext.jsx';
import ChatScreen from './Screens/ChatsScreen.jsx';
import HomeScreen from './Screens/HomeScreen.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <MessageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
          </Routes>
        </BrowserRouter>
      </MessageProvider>
    </UserProvider>
  </StrictMode>
);
