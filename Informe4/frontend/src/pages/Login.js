import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
 
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ registro_academico: '', contrasena: '' });
  const [error, setError] = useState('');
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };
 
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>Facultad de Ingeniería - USAC</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="registro_academico" placeholder="Registro Académico" onChange={handleChange} required />
          <input style={styles.input} name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <button style={styles.btn} type="submit">Iniciar Sesión</button>
        </form>
        <p style={styles.link}>¿No tienes cuenta? <span onClick={() => navigate('/register')} style={styles.linkText}>Regístrate</span></p>
        <p style={styles.link}><span onClick={() => navigate('/reset-password')} style={styles.linkText}>¿Olvidaste tu contraseña?</span></p>
      </div>
    </div>
  );
}
 
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
  title: { textAlign: 'center', marginBottom: '4px', color: '#333' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  btn: { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
  link: { textAlign: 'center', marginTop: '12px', fontSize: '13px' },
  linkText: { color: '#007bff', cursor: 'pointer' },
};
 
export default Login;