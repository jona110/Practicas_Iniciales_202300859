import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
 
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ registro_academico: '', nombres: '', apellidos: '', correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      setSuccess('Usuario registrado correctamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };
 
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="registro_academico" placeholder="Registro Académico" onChange={handleChange} required />
          <input style={styles.input} name="nombres" placeholder="Nombres" onChange={handleChange} required />
          <input style={styles.input} name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
          <input style={styles.input} name="correo" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input style={styles.input} name="contrasena" type="password" placeholder="Contraseña" onChange={handleChange} required />
          <button style={styles.btn} type="submit">Registrarse</button>
        </form>
        <p style={styles.link}>¿Ya tienes cuenta? <span onClick={() => navigate('/login')} style={styles.linkText}>Inicia sesión</span></p>
      </div>
    </div>
  );
}
 
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  btn: { width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
  success: { color: 'green', fontSize: '13px', marginBottom: '10px' },
  link: { textAlign: 'center', marginTop: '12px', fontSize: '13px' },
  linkText: { color: '#007bff', cursor: 'pointer' },
};
 
export default Register;