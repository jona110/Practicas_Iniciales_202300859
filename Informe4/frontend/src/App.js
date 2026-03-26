import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CrearPublicacion from './pages/CrearPublicacion';
import Publicacion from './pages/Publicacion';
import Perfil from './pages/Perfil';
import ResetPassword from './pages/ResetPassword';
 
const PrivateRoute = ({ children }) => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? children : <Navigate to="/login" />;
};
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/crear-publicacion" element={<PrivateRoute><CrearPublicacion /></PrivateRoute>} />
        <Route path="/publicacion/:id" element={<PrivateRoute><Publicacion /></PrivateRoute>} />
        <Route path="/perfil/:registro_academico" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
