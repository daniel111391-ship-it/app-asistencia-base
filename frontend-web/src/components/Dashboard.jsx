import { useState, useEffect } from 'react';
import '../App.css';

export default function Dashboard({ onLogout }) {
    const [vistaActiva, setVistaActiva] = useState('asistencia');
    const [alumnos, setAlumnos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('Todos');
    const [cuentas, setCuentas] = useState([]);
    
    // Nuevos estados para la ventana modal
    const [usuarioAEditar, setUsuarioAEditar] = useState(null);
    const [nuevaClave, setNuevaClave] = useState('');

    const cargarAlumnos = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/alumnos');
            const data = await respuesta.json();
            if (respuesta.ok) setAlumnos(data);
        } catch (error) {
            console.error('Error al conectar:', error);
        }
    };

    const cargarCuentas = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/usuarios/alumnos');
            const data = await respuesta.json();
            if (Array.isArray(data)) setCuentas(data);
        } catch (error) {
            console.error('Error al cargar cuentas:', error);
        }
    };

    useEffect(() => {
        cargarAlumnos();
        cargarCuentas();
    }, []);

    const marcarAsistencia = async (id, tipo) => {
        let bodyDatos = {};
        if (tipo === 'presente') bodyDatos = { presente: true };
        else if (tipo === 'ausente') bodyDatos = { presente: false, justificada: false };
        else if (tipo === 'justificada') bodyDatos = { presente: false, justificada: true };
        else if (tipo === 'tardanza') bodyDatos = { presente: true, tardanza: true };

        try {
            const respuesta = await fetch(`http://localhost:3000/api/alumnos/${id}/asistencia`, {
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyDatos)
            });
            if (respuesta.ok) {
                alert(`Registro guardado correctamente.`);
                cargarAlumnos(); 
            }
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    const abrirModalClave = (id, nombre) => {
        setUsuarioAEditar({ id, nombre });
        setNuevaClave('');
    };

    const confirmarCambioClave = async () => {
        if (nuevaClave.length < 6) return alert('Error: La contraseña debe tener al menos 6 caracteres.');

        try {
            const respuesta = await fetch(`http://localhost:3000/api/usuarios/${usuarioAEditar.id}/credenciales`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: nuevaClave })
            });

            if (respuesta.ok) {
                alert(`Contraseña actualizada exitosamente para ${usuarioAEditar.nombre}.`);
                setUsuarioAEditar(null);
            } else {
                alert('Hubo un error al intentar actualizar la contraseña.');
            }
        } catch (error) {
            console.error('Error al cambiar clave:', error);
            alert('Error de conexión con el servidor.');
        }
    };

    const cursosDisponibles = [
        'Todos', '1ro 1ra', '1ro 2da', '1ro 3ra', '2do 1ra', '2do 2da', '2do 3ra',
        '3ro 1ra', '3ro 2da', '3ro 3ra', '4to 1ra', '4to 2da', '4to 3ra',
        '5to 1ra', '5to 2da', '6to 1ra', '6to 2da', '7ma 1ra', '7ma 2da'
    ];

    const alumnosMostrados = cursoSeleccionado === 'Todos' 
        ? alumnos 
        : alumnos.filter(a => a.curso === cursoSeleccionado);

    return (
        <div className="contenedor-dashboard">
            <h1 className="titulo-principal">Panel de Administración - Aula</h1>
            
            <div className="tarjeta-formulario" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setVistaActiva('asistencia')} 
                        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: vistaActiva === 'asistencia' ? '#2c3e50' : '#bdc3c7', color: 'white' }}
                    >
                        Pasar Asistencia
                    </button>
                    <button 
                        onClick={() => setVistaActiva('cuentas')} 
                        style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: vistaActiva === 'cuentas' ? '#2c3e50' : '#bdc3c7', color: 'white' }}
                    >
                        Gestionar Cuentas
                    </button>
                </div>
                
                <button className="boton-primario" onClick={onLogout} style={{ backgroundColor: '#e74c3c', margin: 0 }}>
                    Cerrar Sesión
                </button>
            </div>

            {vistaActiva === 'asistencia' && (
                <div className="seccion-lista">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h2 style={{ margin: 0 }}>Lista de Alumnos</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Filtrar por curso:</label>
                            <select 
                                value={cursoSeleccionado} 
                                onChange={(e) => setCursoSeleccionado(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
                            >
                                {cursosDisponibles.map(curso => (
                                    <option key={curso} value={curso}>{curso}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <ul className="lista-usuarios">
                        {alumnosMostrados.length > 0 ? (
                            alumnosMostrados.map((alumno) => {
                                const totalFechas = alumno.fechasAsistencia ? alumno.fechasAsistencia.length : 0;
                                const tardanzas = alumno.tardanzas || 0;
                                const presentes = Math.max(0, totalFechas - tardanzas);

                                return (
                                    <li className="item-usuario" key={alumno._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <div className="info-principal">
                                            <strong>{alumno.nombre} {alumno.apellido}</strong>
                                            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>DNI: {alumno.dni} | Curso: {alumno.curso}</div>
                                            <div style={{ fontSize: '0.85em', marginTop: '8px', display: 'flex', gap: '12px', fontWeight: '500' }}>
                                                <span style={{ color: '#27ae60' }}>Presentes: {presentes}</span>
                                                <span style={{ color: '#f39c12' }}>Tardanzas: {tardanzas}</span>
                                                <span style={{ color: '#3498db' }}>Faltas Just.: {alumno.faltasJustificadas || 0}</span>
                                                <span style={{ color: '#e74c3c' }}>Ausencias: {alumno.faltasInjustificadas || 0}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => marcarAsistencia(alumno._id, 'presente')} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Presente</button>
                                            <button onClick={() => marcarAsistencia(alumno._id, 'tardanza')} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Tardanza</button>
                                            <button onClick={() => marcarAsistencia(alumno._id, 'justificada')} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Falta Just.</button>
                                            <button onClick={() => marcarAsistencia(alumno._id, 'ausente')} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Ausente</button>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay alumnos para mostrar en este curso.</p>
                        )}
                    </ul>
                </div>
            )}

            {vistaActiva === 'cuentas' && (
                <div className="seccion-lista">
                    <h2 style={{ marginBottom: '20px' }}>Cuentas de Alumnos</h2>
                    <ul className="lista-usuarios">
                        {cuentas.length > 0 ? (
                            cuentas.map((cuenta) => (
                                <li className="item-usuario" key={cuenta._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <div className="info-principal">
                                        <strong>{cuenta.nombre}</strong>
                                        <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                            Correo: <strong>{cuenta.email}</strong> | DNI: {cuenta.dni || 'No registrado'}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => abrirModalClave(cuenta._id, cuenta.nombre)} 
                                        style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Restablecer Contraseña
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay cuentas de alumnos registradas.</p>
                        )}
                    </ul>
                </div>
            )}

            {/* MODAL DE CAMBIO DE CONTRASEÑA */}
            {usuarioAEditar && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0 }}>Restablecer Contraseña</h3>
                        <p style={{ color: '#555' }}>Nueva clave para <strong>{usuarioAEditar.nombre}</strong>:</p>
                        <input 
                            type="text" 
                            value={nuevaClave}
                            onChange={(e) => setNuevaClave(e.target.value)}
                            placeholder="Mínimo 6 caracteres..."
                            style={{ width: '100%', padding: '10px', margin: '15px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '16px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setUsuarioAEditar(null)} style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#95a5a6', color: 'white', fontWeight: 'bold' }}>Cancelar</button>
                            <button onClick={confirmarCambioClave} style={{ padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#27ae60', color: 'white', fontWeight: 'bold' }}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}