import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
 
function Publicacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [publicacion, setPublicacion] = useState(null);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
 
  const cargar = async () => {
    try {
      const res = await api.get(`/publicaciones/${id}`);
      setPublicacion(res.data);
    } catch (err) {
      console.error(err);
    }
  };
 
  useEffect(() => { cargar(); }, [id]);
 
  const handleComentario = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/comentarios', {
        id_publicacion: id,
        id_usuario_com: usuario.id_usuario,
        mensaje: comentario,
        fecha: new Date().toISOString().split('T')[0],
      });
      setComentario('');
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al comentar');
    }
  };
 
  if (!publicacion) return <div><Navbar /><p style={{ padding: '20px' }}>Cargando...</p></div>;
 
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <button style={styles.btnVolver} onClick={() => navigate('/')}>← Volver</button>
 
        {/* Publicación */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.autor}>👤 {publicacion.nombres} {publicacion.apellidos} ({publicacion.registro_academico})</span>
            <span style={styles.fecha}>{publicacion.fecha}</span>
          </div>
          {publicacion.nombre_curso && <span style={styles.tag}>📚 {publicacion.nombre_curso}</span>}
          {publicacion.nombre_catedratico && <span style={styles.tag}>🎓 {publicacion.nombre_catedratico}</span>}
          <p style={styles.mensaje}>{publicacion.mensaje}</p>
        </div>
 
        {/* Comentarios */}
        <h4 style={styles.subheading}>Comentarios ({publicacion.comentarios?.length || 0})</h4>
        {publicacion.comentarios?.length === 0 && <p style={styles.empty}>Sé el primero en comentar.</p>}
        {publicacion.comentarios?.map(com => (
          <div key={com.id_comentario} style={styles.comentario}>
            <div style={styles.cardHeader}>
              <span style={styles.autor}>👤 {com.nombres} {com.apellidos}</span>
              <span style={styles.fecha}>{com.fecha}</span>
            </div>
            <p style={styles.mensaje}>{com.mensaje}</p>
          </div>
        ))}
 
        {/* Agregar comentario */}
        <div style={styles.formComentario}>
          <h4 style={styles.subheading}>Agregar comentario</h4>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleComentario}>
            <textarea style={styles.textarea} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Escribe un comentario..." rows={3} required />
            <button style={styles.btnPublicar} type="submit">Comentar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  container: { maxWidth: '800px', margin: '20px auto', padding: '0 16px' },
  btnVolver: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '14px', marginBottom: '16px' },
  card: { background: 'white', border: '1px solid #dee2e6', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  comentario: { background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '12px', marginBottom: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  autor: { fontSize: '13px', fontWeight: 'bold', color: '#495057' },
  fecha: { fontSize: '12px', color: '#868e96' },
  tag: { display: 'inline-block', background: '#e9ecef', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', marginRight: '6px', marginBottom: '8px' },
  mensaje: { color: '#333', margin: '8px 0' },
  subheading: { fontSize: '18px', marginBottom: '12px', marginTop: '20px' },
  formComentario: { background: 'white', border: '1px solid #dee2e6', borderRadius: '8px', padding: '16px', marginTop: '16px' },
  textarea: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', resize: 'vertical' },
  btnPublicar: { marginTop: '8px', padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '13px' },
  empty: { color: '#666', fontSize: '14px' },
};
 
export default Publicacion;