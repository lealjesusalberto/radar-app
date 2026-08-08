import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
          bio: '',
          interests: [],
          isPro: false,
          job: '',
          photo: 'https://i.pravatar.cc/150', // Default photo
          gallery: []
        });
      }
      onLogin();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background-animated" style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Orbs with animations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '40vw',
        height: '40vw',
        maxWidth: '400px',
        maxHeight: '400px',
        background: 'radial-gradient(circle, rgba(0,255,204,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        borderRadius: '50%',
        animation: 'floatElement 8s ease-in-out infinite',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '35vw',
        height: '35vw',
        maxWidth: '350px',
        maxHeight: '350px',
        background: 'radial-gradient(circle, rgba(0,153,255,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        borderRadius: '50%',
        animation: 'floatElement 10s ease-in-out infinite reverse',
        zIndex: 0
      }}></div>

      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '420px',
        padding: '48px 40px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '36px', 
            fontWeight: '900', 
            letterSpacing: '3px',
            background: 'linear-gradient(to right, #ffffff, #00ffcc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(0, 255, 204, 0.2)'
          }}>
            RADAR
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '15px', fontWeight: '500' }}>
            {isLogin ? 'Bienvenido de nuevo a la red' : 'Comienza a conectar hoy'}
          </p>
        </div>

        {/* Custom Toggle Switch */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0,0,0,0.4)', 
          padding: '6px', 
          borderRadius: '16px',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Active indicator */}
          <div style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            left: isLogin ? '6px' : 'calc(50% + 3px)',
            width: 'calc(50% - 9px)',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1
          }} />

          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: isLogin ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
              transition: 'color 0.3s ease'
            }}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'transparent',
              color: !isLogin ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
              transition: 'color 0.3s ease'
            }}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            maxHeight: isLogin ? '140px' : '220px',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                opacity: isLogin ? 0 : 1,
                transform: isLogin ? 'translateY(-20px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: isLogin ? 'none' : 'auto',
                position: isLogin ? 'absolute' : 'relative',
                width: '100%'
              }}
            >
              <div className="premium-input-container">
                <input
                  type="text"
                  required={!isLogin}
                  placeholder=" "
                  className="premium-input"
                  id="name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="name-input" className="premium-label">Nombre Completo</label>
              </div>
            </div>

            <div style={{
               transform: isLogin ? 'translateY(0)' : 'translateY(0)',
               transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div className="premium-input-container">
                <input
                  type="email"
                  required
                  placeholder=" "
                  className="premium-input"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email-input" className="premium-label">Correo Electrónico</label>
              </div>
            </div>

            <div style={{
               transform: isLogin ? 'translateY(0)' : 'translateY(0)',
               transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div className="premium-input-container">
                <input
                  type="password"
                  required
                  placeholder=" "
                  className="premium-input"
                  id="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password-input" className="premium-label">Contraseña</label>
              </div>
            </div>
          </div>

          <button type="submit" className="premium-button" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Acceder' : 'Crear Cuenta')}
          </button>
        </form>

        {isLogin && (
          <div style={{ textAlign: 'center' }}>
            <a href="#" style={{ 
              color: 'var(--text-muted)', 
              fontSize: '14px', 
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--radar-color)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
