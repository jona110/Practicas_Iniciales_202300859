import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
 
function CrearPublicacion() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [tipo, setTipo] = useState('curso');
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [form, setForm] = useState({ id_curso: '', id_catedratico: '', mensaje: '', fecha: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
 
  useEffect(() => {
    api.get('/cursos').then(res => setCursos(res.data));
    api.get('/catedraticos').then(res => setCatedraticos(res.data));
  }, []);
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        id_usuario: usuario.id_usuario,
        mensaje: form.mensaje,
        fecha: form.fecha,
        id_curso: tipo === 'curso' ? form.id_curso : null,
        id_catedratico: tipo === 'catedratico' ? form.id_catedratico : null,
      };
      await api.post('/publicaciones', data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear publicación');
    }
  };
 
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h3 style={styles.heading}>Nueva Publicación</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Tipo de publicación</label>
          <div style={styles.radioGroup}>
            <label><input type="radio" value="curso" checked={tipo === 'curso'} onChange={() => setTipo('curso')} /> Curso</label>
            <label style={{ marginLeft: '20px' }}><input type="radio" value="catedratico" checked={tipo === 'catedratico'} onChange={() => setTipo('catedratico')} /> Catedrático</label>
          </div>
 
          {tipo === 'curso' ? (
            <>
              <label style={styles.label}>Curso</label>
              <select style={styles.input} name="id_curso" onChange={handleChange} required>
                <option value="">Selecciona un curso</option>
                {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre_curso}</option>)}
              </select>
            </>
          ) : (
            <>
              <label style={styles.label}>Catedrático</label>
              <select style={styles.input} name="id_catedratico" onChange={handleChange} required>
                <option value="">Selecciona un catedrático</option>
                {catedraticos.map(c => <option key={c.id_catedraticos} value={c.id_catedraticos}>{c.nombres} {c.apellidos}</option>)}
              </select>
            </>
          )}
 
          <label style={styles.label}>Mensaje</label>
          <textarea style={styles.textarea} name="mensaje" placeholder="Escribe tu opinión..." onChange={handleChange} required rows={5} />
 
          <label style={styles.label}>Fecha</label>
          <input style={styles.input} type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
 
          <div style={styles.buttons}>
            <button type="button" style={styles.btnCancelar} onClick={() => navigate('/')}>Cancelar</button>
            <button type="submit" style={styles.btnPublicar}>Publicar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
const styles = {
  container: { maxWidth: '600px', margin: '20px auto', padding: '0 16px' },
  heading: { fontSize: '22px', marginBottom: '16px' },
  form: { background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #dee2e6' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', resize: 'vertical' },
  radioGroup: { marginBottom: '16px' },
  buttons: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  btnPublicar: { padding: '10px 24px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCancelar: { padding: '10px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '13px' },
};
 
export default CrearPublicacion;