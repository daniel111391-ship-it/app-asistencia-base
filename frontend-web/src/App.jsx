import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PanelAlumno from './components/PanelAlumno';

export default function App() {
    // Ahora guardamos todo el objeto usuario, no solo el rol
    const [usuario, setUsuario] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                <Route 
                    path="/login" 
                    element={<Login onLogin={(user) => setUsuario(user)} />} 
                />
                
                <Route 
                    path="/dashboard" 
                    element={
                        usuario?.rol === 'preceptor' || usuario?.rol === 'admin' ? (
                            <Dashboard onLogout={() => setUsuario(null)} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />

                <Route 
                    path="/alumno" 
                    element={
                        usuario?.rol === 'alumno' ? (
                            // Acá le inyectamos el nombre al panel
                            <PanelAlumno nombre={usuario.nombre} dni={usuario.dni} onLogout={() => setUsuario(null)} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}