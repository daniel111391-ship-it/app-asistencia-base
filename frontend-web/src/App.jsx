import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// 1. VISTA: Tablero de Métricas (Gráfico)
function Dashboard() {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/alumnos')
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(error => console.error('Error al cargar:', error));
  }, []);

  const presentes = alumnos.filter(a => a.presente).length;
  const ausentes = alumnos.length - presentes;
  
  const datosTorta = [
    { name: 'Presentes', cantidad: presentes },
    { name: 'Ausentes', cantidad: ausentes }
  ];

  const colores = ['#28a745', '#dc3545'];

  return (
    <div>
      <h2>Métricas Generales de Asistencia</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="tarjeta-formulario" style={{ flex: 1, minWidth: '300px', height: '350px' }}>
          <h3 style={{ textAlign: 'center', color: '#34495e' }}>Estado de Hoy</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={datosTorta} cx="50%" cy="50%" outerRadius={90} dataKey="cantidad" label>
                {datosTorta.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// 2. VISTA: Formulario de Alta
function RegistrarAlumno() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [curso, setCurso] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/alumnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, curso })
    })
    .then(res => res.json())
    .then(() => {
      alert('Alumno registrado correctamente');
      setNombre(''); setApellido(''); setCurso('');
    })
    .catch(error => console.error('Error al guardar:', error));
  };

  return (
    <div className="tarjeta-formulario">
      <h2>Registrar Nuevo Alumno</h2>
      <form onSubmit={handleSubmit} className="formulario-grid">
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input-estilizado" required />
        <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className="input-estilizado" required />
        
        {/* LISTA ACTUALIZADA HASTA 7MO AÑO */}
        <select value={curso} onChange={(e) => setCurso(e.target.value)} className="input-estilizado" required>
          <option value="" disabled>Seleccione el curso...</option>
          <option value="1ro 1ra">1ro 1ra</option>
          <option value="1ro 2da">1ro 2da</option>
          <option value="2do 1ra">2do 1ra</option>
          <option value="2do 2da">2do 2da</option>
          <option value="3ro 1ra">3ro 1ra</option>
          <option value="3ro 2da">3ro 2da</option>
          <option value="4to 1ra">4to 1ra</option>
          <option value="4to 2da">4to 2da</option>
          <option value="5to 1ra">5to 1ra</option>
          <option value="6to 1ra">6to 1ra</option>
          <option value="7mo 1ra">7mo 1ra</option>
        </select>
        
        <button type="submit" className="boton-primario">Guardar Alumno</button>
      </form>
    </div>
  );
}

// 3. VISTA: Tomar Asistencia (Herramienta del Preceptor)
function TomarAsistencia() {
  const [alumnos, setAlumnos] = useState([]);

  const cargarAlumnos = () => {
    fetch('http://localhost:3000/api/alumnos')
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(error => console.error('Error al cargar:', error));
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  // Esta función ahora recibe si está presente, y si la falta es justificada
  const marcarAsistencia = (id, esPresente, esJustificada = false) => {
    fetch(`http://localhost:3000/api/alumnos/${id}/asistencia`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presente: esPresente, justificada: esJustificada })
    })
    .then(res => res.json())
    .then(() => cargarAlumnos()) // Recarga la lista automáticamente
    .catch(error => console.error('Error al actualizar:', error));
  };

  return (
    <div className="tarjeta-formulario">
      <h2>Planilla Diaria</h2>
      <ul className="lista-usuarios">
        {alumnos.map(alumno => (
          <li key={alumno._id} className="item-usuario" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="info-principal">
                <strong>{alumno.apellido}, {alumno.nombre}</strong> <br/>
                <small>Curso: {alumno.curso}</small>
              </div>
              
              {/* CONTADOR VISUAL DE FALTAS */}
              <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#7f8c8d' }}>
                <span style={{ display: 'block' }}>Faltas: <strong>{alumno.faltasInjustificadas || 0}</strong></span>
                <span style={{ display: 'block', color: '#f39c12' }}>Justificadas: <strong>{alumno.faltasJustificadas || 0}</strong></span>
              </div>
            </div>

            {/* BOTONERA DE ASISTENCIA */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', width: '100%' }}>
              <button 
                onClick={() => marcarAsistencia(alumno._id, true)}
                style={{ flex: 1, backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✔ Presente
              </button>
              <button 
                onClick={() => marcarAsistencia(alumno._id, false, false)}
                style={{ flex: 1, backgroundColor: '#dc3545', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✖ Injustificada
              </button>
              <button 
                onClick={() => marcarAsistencia(alumno._id, false, true)}
                style={{ flex: 1, backgroundColor: '#f39c12', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📝 Justificada
              </button>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

// MOTOR DE RUTAS PRINCIPAL
function App() {
  return (
    <Router>
      <div className="contenedor-dashboard">
        <h1 className="titulo-principal">Asistencia Escolar - Villa San Agustín</h1>
        
        <nav style={{ background: '#2c3e50', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>📊 Tablero</Link>
          <Link to="/registrar" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>➕ Inscribir</Link>
          <Link to="/asistencia" style={{ color: '#f1c40f', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}>📝 Tomar Asistencia</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registrar" element={<RegistrarAlumno />} />
          <Route path="/asistencia" element={<TomarAsistencia />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;