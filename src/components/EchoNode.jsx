import React from 'react';

const EchoNode = ({ echo, onClick }) => {
  // Convertimos las coordenadas (porcentaje) a posición absoluta dentro del contenedor del radar
  const positionStyle = {
    position: 'absolute',
    left: `${echo.x}%`,
    top: `${echo.y}%`,
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    animation: 'float 3s ease-in-out infinite',
    zIndex: 25,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  };

  const avatarContainerStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    animation: 'pulseGlow 2s infinite',
    border: '2px solid var(--radar-color)',
    overflow: 'hidden',
    boxShadow: '0 0 10px var(--radar-color-glow)',
  };

  const avatarImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    pointerEvents: 'none', // Para no interferir con el click en el avatar
  };

  return (
    <div style={positionStyle} onClick={() => onClick(echo)}>
      <div style={avatarContainerStyle}>
        <img src={echo.user.photo} alt={echo.user.name} style={avatarImageStyle} />
      </div>
      <div style={distanceBadgeStyle}>
        {echo.distance}m
      </div>
    </div>
  );
};

export default EchoNode;
