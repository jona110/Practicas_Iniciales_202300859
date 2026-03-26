import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
 
function Home() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('ninguno');
  const [loading, setLoading] = useState(true);
 
  const cargarPublicaciones = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/publicaciones', { params });
      setPublicaciones(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
 
  useEffect(() => { cargarPublicaciones(); }, []);
 
  const handleBuscar = () => {
    if (filtro === 'ninguno') { cargarPublicaciones(); return; }
    const params = {};
    if (filtro === 'nombre_curso') params.nombre_curso = busqueda;
    if (filtro === 'nombre_catedratico') params.nombre_catedratico = busqueda;
    cargarPublicaciones(params);
  };
 
  const handleLimpiar = () => {
    setBusqueda('');
    setFiltro('ninguno');
    cargarPublicaciones();
  };
 
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h3 style={styles.heading}>Publicaciones</h3>
 
        {/* Filtros */}
        <div style={styles.filtros}>
          <select style={styles.select} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="ninguno">Sin filtro</option>
            <option value="nombre_curso">Por nombre de curso</option>
            <option value="nombre_catedratico">Por nombre de catedrático</option>
          </select>
          {filtro !== 'ninguno' && (
            <input style={styles.input} placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          )}
          <button style={styles.btnBuscar} onClick={handleBuscar}>Buscar</button>
          <button style={styles.btnLimpiar} onClick={handleLimpiar}>Limpiar</button>
        </div>
 
        {/* Lista de publicaciones */}
        {loading ? <p>Cargando...</p> : publicaciones.length === 0 ? (
          <p style={styles.empty}>No hay publicaciones aún.</p>
        ) : (
          publicaciones.map((pub) => (
            <div key={pub.id_publicacion} style={styles.card} onClick={() => navigate(`/publicacion/${pub.id_publicacion}`)}>
              <div style={styles.cardHeader}>
                <span style={styles.autor}>👤 {pub.usuario_nombres} {pub.usuario_apellidos} ({pub.registro_academico})</span>
                <span style={styles.fecha}>{pub.fecha}</span>
              </div>
              {pub.nombre_curso && <span style={styles.tag}>📚 {pub.nombre_curso}</span>}
              {pub.nombre_catedratico && <span style={styles.tag}>🎓 {pub.nombre_catedratico}</span>}
              <p style={styles.mensaje}>{pub.mensaje}</p>
              <span style={styles.verMas}>Ver comentarios →</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
 
const styles = {
  container: { maxWidth: '800px', margin: '20px auto', padding: '0 16px' },
  heading: { fontSize: '22px', marginBottom: '16px' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  select: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 },
  btnBuscar: { padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnLimpiar: { padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  card: { background: 'white', border: '1px solid #dee2e6', borderRadius: '8px', padding: '16px', marginBottom: '12px', cursor: 'pointer', transition: 'box-shadow 0.2s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  autor: { fontSize: '13px', fontWeight: 'bold', color: '#495057' },
  fecha: { fontSize: '12px', color: '#868e96' },
  tag: { display: 'inline-block', background: '#e9ecef', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', marginRight: '6px', marginBottom: '8px' },
  mensaje: { color: '#333', margin: '8px 0' },
  verMas: { fontSize: '13px', color: '#007bff' },
  empty: { color: '#666', textAlign: 'center', marginTop: '40px' },
};
 
export default Home;