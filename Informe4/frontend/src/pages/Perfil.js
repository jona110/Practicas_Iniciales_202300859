import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
 
function Perfil() {
  const { registro_academico } = useParams();
  const navigate = useNavigate();
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
  const esMiPerfil = usuarioLogueado?.registro_academico === registro_academico;
 
  const [perfil, setPerfil] = useState(null);
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [nuevoCurso, setNuevoCurso] = useState({ id_curso_curapro: '', fecha_aprobacion: '' });
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 
  const cargarPerfil = async () => {
    try {
      const res = await api.get(`/usuarios/${registro_academico}`);
      setPerfil(res.data);
      setFormEdit({ nombres: res.data.nombres, apellidos: res.data.apellidos, correo: res.data.correo });
      const cursosRes = await api.get(`/usuarios/${res.data.id_usuario}/cursos-aprobados`);
      setCursosAprobados(cursosRes.data);
    } catch (err) {
      console.error(err);
    }
  };
 
  useEffect(() => {
    cargarPerfil();
    if (esMiPerfil) api.get('/cursos').then(res => setCursos(res.data));
  }, [registro_academico]);
 
  const handleActualizar = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.put(`/usuarios/${perfil.id_usuario}`, formEdit);
      setSuccess('Datos actualizados correctamente');
      setEditando(false);
      cargarPerfil();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar');
    }
  };
 
  const handleAgregarCurso = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post(`/usuarios/${perfil.id_usuario}/cursos-aprobados`, nuevoCurso);
      setSuccess('Curso agregado');
      setNuevoCurso({ id_curso_curapro: '', fecha_aprobacion: '' });
      cargarPerfil();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar curso');
    }
  };
 
  const handleEliminarCurso = async (id_registro) => {
    try {
      await api.delete(`/usuarios/${perfil.id_usuario}/cursos-aprobados/${id_registro}`);
      cargarPerfil();
    } catch (err) {
      setError('Error al eliminar curso');
    }
  };
 
  if (!perfil) return <div><Navbar /><p style={{ padding: '20px' }}>Cargando...</p></div>;
 
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <button style={styles.btnVolver} onClick={() => navigate('/')}>← Volver</button>
 
        {/* Info del usuario */}
        <div style={styles.card}>
          <h3 style={styles.nombre}>{perfil.nombres} {perfil.apellidos}</h3>
          <p style={styles.info}>📋 Registro: {perfil.registro_academico}</p>
          <p style={styles.info}>✉️ {perfil.correo}</p>
          {esMiPerfil && !editando && (
            <button style={styles.btnEditar} onClick={() => setEditando(true)}>Editar perfil</button>
          )}
        </div>
 
        {/* Formulario edición */}
        {esMiPerfil && editando && (
          <div style={styles.card}>
            <h4>Editar datos</h4>
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}
            <form onSubmit={handleActualizar}>
              <input style={styles.input} value={formEdit.nombres} onChange={e => setFormEdit({ ...formEdit, nombres: e.target.value })} placeholder="Nombres" required />
              <input style={styles.input} value={formEdit.apellidos} onChange={e => setFormEdit({ ...formEdit, apellidos: e.target.value })} placeholder="Apellidos" required />
              <input style={styles.input} type="email" value={formEdit.correo} onChange={e => setFormEdit({ ...formEdit, correo: e.target.value })} placeholder="Correo" required />
              <input style={styles.input} type="password" onChange={e => setFormEdit({ ...formEdit, contrasena: e.target.value })} placeholder="Nueva contraseña (opcional)" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.btnGuardar}>Guardar</button>
                <button type="button" style={styles.btnCancelar} onClick={() => setEditando(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
 
        {/* Cursos aprobados */}
        <div style={styles.card}>
          <h4>Cursos Aprobados — Total créditos: <strong>{cursosAprobados.total_creditos || 0}</strong></h4>
          {cursosAprobados.cursos?.length === 0 ? (
            <p style={styles.empty}>No hay cursos aprobados registrados.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Curso</th>
                  <th style={styles.th}>Área</th>
                  <th style={styles.th}>Créditos</th>
                  <th style={styles.th}>Fecha</th>
                  {esMiPerfil && <th style={styles.th}>Acción</th>}
                </tr>
              </thead>
              <tbody>
                {cursosAprobados.cursos?.map(c => (
                  <tr key={c.id_registro}>
                    <td style={styles.td}>{c.nombre_curso}</td>
                    <td style={styles.td}>{c.area}</td>
                    <td style={styles.td}>{c.creditos}</td>
                    <td style={styles.td}>{c.fecha_aprobacion}</td>
                    {esMiPerfil && (
                      <td style={styles.td}>
                        <button style={styles.btnEliminar} onClick={() => handleEliminarCurso(c.id_registro)}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
 
          {/* Agregar curso (solo mi perfil) */}
          {esMiPerfil && (
            <form onSubmit={handleAgregarCurso} style={styles.formCurso}>
              <h5 style={{ marginBottom: '10px' }}>Agregar curso aprobado</h5>
              {error && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.success}>{success}</p>}
              <select style={styles.input} value={nuevoCurso.id_curso_curapro} onChange={e => setNuevoCurso({ ...nuevoCurso, id_curso_curapro: e.target.value })} required>
                <option value="">Selecciona un curso</option>
                {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre_curso}</option>)}
              </select>
              <input style={styles.input} type="date" value={nuevoCurso.fecha_aprobacion} onChange={e => setNuevoCurso({ ...nuevoCurso, fecha_aprobacion: e.target.value })} required />
              <button type="submit" style={styles.btnGuardar}>Agregar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  container: { maxWidth: '800px', margin: '20px auto', padding: '0 16px' },
  btnVolver: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '14px', marginBottom: '16px' },
  card: { background: 'white', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px', marginBottom: '16px' },
  nombre: { margin: '0 0 8px 0' },
  info: { fontSize: '14px', color: '#555', margin: '4px 0' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { background: '#f8f9fa', padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontSize: '13px' },
  td: { padding: '8px', borderBottom: '1px solid #dee2e6', fontSize: '13px' },
  formCurso: { marginTop: '20px', borderTop: '1px solid #dee2e6', paddingTop: '16px' },
  btnEditar: { marginTop: '10px', padding: '6px 14px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnGuardar: { padding: '8px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCancelar: { padding: '8px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnEliminar: { padding: '4px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  error: { color: 'red', fontSize: '13px' },
  success: { color: 'green', fontSize: '13px' },
  empty: { color: '#666', fontSize: '14px' },
};
 
export default Perfil;