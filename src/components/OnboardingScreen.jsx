import React from 'react';

const OnboardingScreen = ({ onEnter }) => {
  return (
    <div style={styles.container}>
      {/* Imagen de fondo generada para el concepto de la app */}
      <img src="/onboarding_cover.png" alt="Onboarding Cover" style={styles.backgroundImage} />
      <div style={styles.overlay}></div>
      
      <div style={styles.content}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>ORBIT</h1>
          <p style={styles.tagline}>Encuentra tu sintonía</p>
        </div>

        <div style={styles.bottomSection}>
          <h2 style={styles.title}>Conecta de forma real, en tiempo real.</h2>
          <p style={styles.description}>
            Lanza ecos en el mapa, mira quién está cerca de ti y acerca a los chicos que más te interesen a tu órbita.
          </p>
          <button style={styles.enterButton} onClick={onEnter}>
            Comenzar a explorar ➔
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100vw',
    height: '100dvh', // Use dynamic viewport height for mobile browsers
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 9999, /* Por encima de toda la app */
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(5, 11, 20, 0.3) 0%, rgba(5, 11, 20, 0.7) 50%, rgba(5, 11, 20, 1) 100%)',
    zIndex: 2,
  },
  content: {
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    padding: '40px 24px',
    boxSizing: 'border-box',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  logoImage: {
    width: '160px',
    height: 'auto',
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8))',
  },
  logoText: {
    fontSize: '48px',
    fontWeight: '900',
    letterSpacing: '4px',
    margin: 0,
    color: '#fff',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
  },
  logoAccent: {
    color: 'var(--radar-color)',
  },
  tagline: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.8)',
    marginTop: '4px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  description: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    marginBottom: '32px',
    lineHeight: '1.5',
    maxWidth: '300px',
  },
  enterButton: {
    width: '100%',
    maxWidth: '320px',
    padding: '18px 24px',
    backgroundColor: 'var(--radar-color)',
    color: '#000',
    fontSize: '18px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0, 255, 204, 0.4)',
    transition: 'transform 0.2s',
  }
};

export default OnboardingScreen;
