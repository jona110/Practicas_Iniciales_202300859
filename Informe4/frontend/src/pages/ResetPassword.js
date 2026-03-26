import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ registro_academico: '', correo: '', nueva_contrasena: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.put('/auth/reset-password', form);
      setSuccess('Contraseña actualizada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Los datos ingresados son incorrectos');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Recuperar Contraseña</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="registro_academico" placeholder="Registro Académico" onChange={handleChange} required />
          <input style={styles.input} name="correo" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input style={styles.input} name="nueva_contrasena" type="password" placeholder="Nueva contraseña" onChange={handleChange} required />
          <button style={styles.btn} type="submit">Actualizar contraseña</button>
        </form>
        <p style={styles.link}>
          <span onClick={() => navigate('/login')} style={styles.linkText}>← Volver al login</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  btn: { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', fontSize: '13px', marginBottom: '10px' },
  success: { color: 'green', fontSize: '13px', marginBottom: '10px' },
  link: { textAlign: 'center', marginTop: '12px', fontSize: '13px' },
  linkText: { color: '#007bff', cursor: 'pointer' },
};

export default ResetPassword;