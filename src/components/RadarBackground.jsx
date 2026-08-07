import React from 'react';

const RadarBackground = ({ children }) => {
  return (
    <div style={styles.container}>
      {/* Anillos concéntricos (Órbitas) - Usamos vmin para ser responsive */}
      <div style={{ ...styles.ring, width: '90vmin', height: '90vmin', opacity: 0.1 }}></div>
      <div style={{ ...styles.ring, width: '65vmin', height: '65vmin', opacity: 0.3 }}></div>
      <div style={{ ...styles.ring, width: '40vmin', height: '40vmin', opacity: 0.6 }}></div>
      
      {/* Centro del radar (Tú) */}
      <div style={styles.centerPoint}></div>

      {/* Líneas cruzadas */}
      <div style={styles.horizontalLine}></div>
      <div style={styles.verticalLine}></div>

      {/* Efecto de barrido (sweep) */}
      <div style={styles.sweepContainer}>
        <div style={styles.sweep}></div>
      </div>

      {/* Capa de los Ecos */}
      <div style={styles.echoesLayer}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderRadius: '50%',
    border: '2px solid var(--radar-color)',
    pointerEvents: 'none',
  },
  centerPoint: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 15px 4px #fff',
    zIndex: 10,
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--ring-color)',
    pointerEvents: 'none',
  },
  verticalLine: {
    position: 'absolute',
    height: '100%',
    width: '1px',
    backgroundColor: 'var(--ring-color)',
    pointerEvents: 'none',
  },
  sweepContainer: {
    position: 'absolute',
    width: '90vmin',
    height: '90vmin',
    borderRadius: '50%',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  sweep: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '50%',
    transformOrigin: '0% 100%',
    background: 'conic-gradient(from 270deg, transparent 0deg, rgba(0, 255, 204, 0.4) 90deg, transparent 91deg)',
    animation: 'sweep 4s linear infinite',
  },
  echoesLayer: {
    position: 'absolute',
    width: '90vmin',
    height: '90vmin',
    zIndex: 20, /* Por encima de las líneas, debajo del modal */
  }
};

export default RadarBackground;
