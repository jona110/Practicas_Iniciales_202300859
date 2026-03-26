import React from 'react';
import { useNavigate } from 'react-router-dom';
 
function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
 
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };
 
  return (
    <nav style={styles.nav}>
      <span style={styles.brand} onClick={() => navigate('/')}>📋 Práctica Web USAC</span>
      <div style={styles.actions}>
        <span style={styles.user}>👤 {usuario?.nombres} {usuario?.apellidos}</span>
        <button style={styles.btn} onClick={() => navigate(`/perfil/${usuario?.registro_academico}`)}>Mi Perfil</button>
        <button style={styles.btn} onClick={() => navigate('/crear-publicacion')}>+ Publicación</button>
        <button style={{ ...styles.btn, background: '#dc3545' }} onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  );
}
 
const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#343a40', color: 'white', padding: '10px 20px' },
  brand: { fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' },
  actions: { display: 'flex', gap: '10px', alignItems: 'center' },
  user: { fontSize: '14px' },
  btn: { background: '#007bff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
};
 
export default Navbar;