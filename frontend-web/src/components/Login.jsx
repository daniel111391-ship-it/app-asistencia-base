import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const manejarEnvio = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Por favor, completá ambos campos.');
            return;
        }

        try {
            const respuesta = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.ok) {
                setError('');
                // Pasamos todo el objeto del usuario (incluyendo el nombre) a App.jsx
                onLogin(data.datos); 
                
                if (data.datos.rol === 'alumno') {
                    navigate('/alumno');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.mensaje || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión con el servidor. ¿Está encendido el backend?');
        }
    };

    return (
        <div className="login-mode">
            <div id="login" style={{ display: 'grid' }}>
                <section className="login-card">
                    <img className="login-crest" src="/escudo.png" alt="Escudo de la escuela" />
                    <div className="eyebrow">Valle Fértil · San Juan</div>
                    <h1>Bienvenido a Aula</h1>
                    <p>Escuela Agrotécnica Ejército Argentino</p>
                    
                    <form onSubmit={manejarEnvio}>
                        <label>
                            Correo electrónico
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nombre@escuela.com"
                                required 
                            />
                        </label>
                        <label>
                            Contraseña
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </label>
                        
                        {error && <p className="formerror" role="alert">{error}</p>}
                        
                        <button className="btn primary login-submit" type="submit">
                            Ingresar
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}