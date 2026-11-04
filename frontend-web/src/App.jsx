import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PanelAlumno from './components/PanelAlumno';

export default function App() {
    // 1. Al iniciar, verificamos si ya hay un usuario guardado en el navegador
    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = localStorage.getItem('usuarioAula');
        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    });

    // 2. Función para guardar los datos cuando inicia sesión
    const manejarLogin = (user) => {
        setUsuario(user);
        localStorage.setItem('usuarioAula', JSON.stringify(user));
    };

    // 3. Función para borrar los datos al cerrar sesión
    const manejarLogout = () => {
        setUsuario(null);
        localStorage.removeItem('usuarioAula');
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route 
                    path="/login" 
                    element={<Login onLogin={manejarLogin} />} 
                />
                
                <Route 
                    path="/dashboard" 
                    element={
                        usuario?.rol === 'preceptor' || usuario?.rol === 'admin' ? (
                            <Dashboard onLogout={manejarLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />

                <Route 
                    path="/alumno" 
                    element={
                        usuario?.rol === 'alumno' ? (
                            <PanelAlumno nombre={usuario.nombre} dni={usuario.dni} onLogout={manejarLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}