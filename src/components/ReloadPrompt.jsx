import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 255, 204, 0.1)',
        border: '1px solid var(--radar-color)',
        color: '#fff',
        padding: '30px 20px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,255,204,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        textAlign: 'center',
        width: '85%',
        maxWidth: '350px'
      }}>
        <div style={{ fontSize: '40px' }}>🚀</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          ¡Actualización disponible!
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Hemos lanzado una nueva versión de Orbit con mejoras importantes.
        </div>
        <button 
          onClick={() => updateServiceWorker(true)}
          style={{
            width: '100%',
            backgroundColor: 'var(--radar-color)',
            color: '#000',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 0 15px var(--radar-color-glow)'
          }}
        >
          Actualizar ahora
        </button>
      </div>
    </div>
  );
}

export default ReloadPrompt;
