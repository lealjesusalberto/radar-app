import React from 'react';

const BottomNav = ({ activeTab, onChangeTab }) => {
  return (
    <div style={styles.outerContainer}>
      <div style={styles.navContainer}>
        
        {/* Radar Tab */}
        <button 
          style={styles.navButton}
          onClick={() => onChangeTab('radar')}
        >
          <div style={activeTab === 'radar' ? { ...styles.iconWrapper, ...styles.activeIconWrapper } : styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'radar' ? '#000' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>
          {activeTab === 'radar' && <span style={styles.activeDot}></span>}
        </button>

        {/* Chats Tab */}
        <button 
          style={styles.navButton}
          onClick={() => onChangeTab('chats')}
        >
          <div style={activeTab === 'chats' ? { ...styles.iconWrapper, ...styles.activeIconWrapper } : styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'chats' ? '#000' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          {activeTab === 'chats' && <span style={styles.activeDot}></span>}
        </button>

        {/* Perfil Tab */}
        <button 
          style={styles.navButton}
          onClick={() => onChangeTab('perfil')}
        >
          <div style={activeTab === 'perfil' ? { ...styles.iconWrapper, ...styles.activeIconWrapper } : styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'perfil' ? '#000' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          {activeTab === 'perfil' && <span style={styles.activeDot}></span>}
        </button>

      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
    pointerEvents: 'none', // Para no bloquear clics fuera de la cápsula
  },
  navContainer: {
    pointerEvents: 'auto',
    backgroundColor: 'rgba(10, 25, 47, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 255, 204, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 204, 0.1)',
    borderRadius: '40px', // Diseño de cápsula
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    width: '90%',
    maxWidth: '320px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    position: 'relative',
    padding: '4px 12px',
    outline: 'none',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Efecto resorte
    backgroundColor: 'transparent',
  },
  activeIconWrapper: {
    backgroundColor: 'var(--radar-color)',
    boxShadow: '0 0 15px rgba(0, 255, 204, 0.6)',
    transform: 'translateY(-12px)', // Salta hacia arriba
  },
  activeDot: {
    position: 'absolute',
    bottom: '-2px',
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--radar-color)',
    borderRadius: '50%',
    boxShadow: '0 0 8px var(--radar-color)',
    animation: 'pulseGlow 2s infinite',
  }
};

export default BottomNav;
