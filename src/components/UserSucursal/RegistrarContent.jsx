import React, { useState, useEffect } from 'react';
import { useAuthUsuarioSucursal } from '../../contexts/AuthUsuarioSucursalContext';
import '../../styles/ModuleContent.css';

const RegistrarContent = () => {
  const { user } = useAuthUsuarioSucursal();
  const [activeTab, setActiveTab] = useState('asistencia');
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Datos a registrar:', { ...formData, tipo: activeTab });
      
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Registro guardado exitosamente');
      
      // Limpiar formulario
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        observaciones: ''
      });
    } catch (error) {
      setMessage('Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  const renderAsistenciaForm = () => (
    <div className="form-container">
      <h3>Registrar Asistencia</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="observaciones">Observaciones:</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows="3"
            placeholder="Observaciones adicionales (opcional)"
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Guardando...' : 'Registrar Asistencia'}
        </button>
      </form>
    </div>
  );

  const renderCalificacionesForm = () => (
    <div className="form-container">
      <h3>Registrar Calificaciones</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="estudiante">Estudiante:</label>
          <select
            id="estudiante"
            name="estudiante"
            value={formData.estudiante || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccionar estudiante</option>
            <option value="1">Juan Pérez</option>
            <option value="2">María García</option>
            <option value="3">Carlos López</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="materia">Materia:</label>
          <select
            id="materia"
            name="materia"
            value={formData.materia || ''}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccionar materia</option>
            <option value="1">Matemáticas</option>
            <option value="2">Español</option>
            <option value="3">Ciencias</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="calificacion">Calificación:</label>
          <input
            type="number"
            id="calificacion"
            name="calificacion"
            value={formData.calificacion || ''}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="observaciones">Observaciones:</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows="3"
            placeholder="Observaciones sobre la calificación (opcional)"
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Guardando...' : 'Registrar Calificación'}
        </button>
      </form>
    </div>
  );

  const renderEventosForm = () => (
    <div className="form-container">
      <h3>Registrar Eventos</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título del Evento:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleInputChange}
            rows="4"
            placeholder="Descripción del evento"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Guardando...' : 'Registrar Evento'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="module-content">
      <div className="module-header">
        <h2>Módulo de Registro</h2>
        <p>Registra asistencia, calificaciones y eventos</p>
      </div>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'asistencia' ? 'active' : ''}`}
          onClick={() => setActiveTab('asistencia')}
        >
          Asistencia
        </button>
        <button 
          className={`tab ${activeTab === 'calificaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('calificaciones')}
        >
          Calificaciones
        </button>
        <button 
          className={`tab ${activeTab === 'eventos' ? 'active' : ''}`}
          onClick={() => setActiveTab('eventos')}
        >
          Eventos
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'asistencia' && renderAsistenciaForm()}
        {activeTab === 'calificaciones' && renderCalificacionesForm()}
        {activeTab === 'eventos' && renderEventosForm()}
      </div>
    </div>
  );
};

export default RegistrarContent;