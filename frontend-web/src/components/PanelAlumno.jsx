import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../App.css';

export default function PanelAlumno({ nombre, dni, onLogout }) {
    const [datosAsistencia, setDatosAsistencia] = useState([]);

    useEffect(() => {
        const cargarDatosAlumno = async () => {
            if (!dni) return;
            try {
                const respuesta = await fetch(`http://localhost:3000/api/alumnos/dni/${dni}`);
                
                if (respuesta.ok) {
                    const alumno = await respuesta.json();
                    const datosReales = alumno.datos ? alumno.datos : alumno;

                    const totalFechas = datosReales.fechasAsistencia ? datosReales.fechasAsistencia.length : 0;
                    const tardanzas = datosReales.tardanzas || 0;
                    const presentes = Math.max(0, totalFechas - tardanzas);
                    const faltasJust = datosReales.faltasJustificadas || 0;
                    const ausencias = datosReales.faltasInjustificadas || 0;

                    // Orden exacto de colores según tu diseño
                    setDatosAsistencia([
                        { name: 'Presentes', value: presentes, color: '#27ae60' },
                        { name: 'Ausencias', value: ausencias, color: '#e74c3c' },
                        { name: 'Faltas Just.', value: faltasJust, color: '#3498db' },
                        { name: 'Tardanzas', value: tardanzas, color: '#f39c12' }
                    ]);
                }
            } catch (error) {
                console.error('Error al cargar datos del gráfico:', error);
            }
        };

        cargarDatosAlumno();
    }, [dni]);

    return (
        <div className="contenedor-dashboard">
            <h1 className="titulo-principal">Mi Asistencia</h1>
            
            <div className="tarjeta-formulario" style={{ marginBottom: '20px' }}>
                <h2>Hola, {nombre}</h2>
                <p>Acá podés ver el resumen visual de tu estado en el ciclo lectivo.</p>
                <button className="boton-primario" onClick={onLogout} style={{ backgroundColor: '#e74c3c' }}>
                    Cerrar Sesión
                </button>
            </div>

            <div className="seccion-lista" style={{ height: '400px', padding: '20px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Distribución de Asistencia</h3>
                
                {datosAsistencia.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={datosAsistencia} 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={100} 
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {datosAsistencia.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                        Todavía no tenés registros de asistencia cargados en el sistema.
                    </p>
                )}
            </div>
        </div>
    );
}