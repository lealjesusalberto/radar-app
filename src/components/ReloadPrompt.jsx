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
      bottom: '100px', // Just above bottom nav
      left: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 255, 204, 0.1)',
      border: '1px solid var(--radar-color)',
      color: '#fff',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 9999,
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🚀</span> ¡Hay una nueva versión de Orbit disponible!
      </div>
      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
        <button 
          onClick={() => updateServiceWorker(true)}
          style={{
            flex: 1,
            backgroundColor: 'var(--radar-color)',
            color: '#000',
            border: 'none',
            padding: '10px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Actualizar ahora
        </button>
        <button 
          onClick={() => setNeedRefresh(false)}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--glass-border)',
            padding: '10px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Más tarde
        </button>
      </div>
    </div>
  );
}

export default ReloadPrompt;
