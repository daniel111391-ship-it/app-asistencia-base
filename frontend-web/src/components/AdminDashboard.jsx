import { useState, useEffect } from 'react';
import '../App.css';

export default function AdminDashboard({ onLogout }) {
    const [usuarios, setUsuarios] = useState([]);
    
    // Nuevos estados para la ventana modal
    const [usuarioAEditar, setUsuarioAEditar] = useState(null);
    const [nuevaClave, setNuevaClave] = useState('');

    const cargarUsuarios = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/usuarios');
            const data = await respuesta.json();
            
            if (respuesta.ok && data.datos) {
                setUsuarios(data.datos.filter(u => u.rol !== 'admin'));
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const abrirModalClave = (id, nombre, rol) => {
        setUsuarioAEditar({ id, nombre, rol });
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

    return (
        <div className="contenedor-dashboard">
            <h1 className="titulo-principal">Panel de Director/Administrador</h1>
            
            <div className="tarjeta-formulario" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h2>Gestión Global de Cuentas</h2>
                <button className="boton-primario" onClick={onLogout} style={{ backgroundColor: '#e74c3c', margin: 0 }}>
                    Cerrar Sesión
                </button>
            </div>

            <div className="seccion-lista">
                <h3 style={{ marginBottom: '20px' }}>Todos los Usuarios Registrados</h3>
                <ul className="lista-usuarios">
                    {usuarios.length > 0 ? (
                        usuarios.map((cuenta) => (
                            <li className="item-usuario" key={cuenta._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <div className="info-principal">
                                    <strong>{cuenta.nombre}</strong> 
                                    <span style={{ 
                                        padding: '2px 8px', 
                                        background: cuenta.rol === 'preceptor' ? '#8e44ad' : '#2980b9', 
                                        color: 'white', 
                                        borderRadius: '4px', 
                                        fontSize: '0.8em', 
                                        marginLeft: '8px',
                                        textTransform: 'capitalize'
                                    }}>
                                        {cuenta.rol}
                                    </span>
                                    <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                        Correo: <strong>{cuenta.email}</strong> {cuenta.dni ? `| DNI: ${cuenta.dni}` : ''}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => abrirModalClave(cuenta._id, cuenta.nombre, cuenta.rol)} 
                                    style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Restablecer Contraseña
                                </button>
                            </li>
                        ))
                    ) : (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay cuentas registradas en el sistema.</p>
                    )}
                </ul>
            </div>

            {/* MODAL DE CAMBIO DE CONTRASEÑA ADMIN */}
            {usuarioAEditar && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0 }}>Restablecer Contraseña</h3>
                        <p style={{ color: '#555' }}>Nueva clave para el {usuarioAEditar.rol} <strong>{usuarioAEditar.nombre}</strong>:</p>
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