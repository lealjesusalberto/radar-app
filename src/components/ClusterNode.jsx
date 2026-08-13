import React from 'react';

const ClusterNode = ({ count, x, y, onClick }) => {
  const positionStyle = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%)`,
    cursor: 'pointer',
    animation: 'float 3s ease-in-out infinite',
    zIndex: 25,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  };

  const bubbleStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: 'var(--radar-color)',
    color: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    border: '2px solid rgba(255,255,255,0.8)',
    boxShadow: '0 0 15px var(--radar-color-glow)',
    animation: 'pulseGlow 2s infinite',
  };

  const distanceBadgeStyle = {
    backgroundColor: 'rgba(10, 25, 47, 0.9)',
    color: 'var(--radar-color)',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '8px',
    border: '1px solid var(--radar-color-dim)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };

  return (
    <div style={positionStyle} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <div style={bubbleStyle}>
        +{count}
      </div>
      <div style={distanceBadgeStyle}>
        Expandir
      </div>
    </div>
  );
};

export default ClusterNode;
