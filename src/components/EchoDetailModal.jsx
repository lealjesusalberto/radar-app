import React, { useState } from 'react';

const EchoDetailModal = ({ echo, onClose, onLike, onChat, onViewProfile }) => {
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!echo) return null;

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(echo, !liked);
  };

  const handleViewProfileClick = () => {
    // Por petición del usuario, TODOS los perfiles abren la vista completa por ahora.
    // Mantenemos la lógica de showFullProfile en el código para usarla más adelante.
    onViewProfile(echo.user);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={showFullProfile ? { ...styles.modal, ...styles.modalExpanded } : styles.modal} 
        onClick={(e) => e.stopPropagation()} 
      >
        <div style={styles.header}>
          <img 
            src={echo.user.photo} 
            alt="profile" 
            style={styles.avatar} 
          />
          <div style={styles.headerText}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={styles.userName}>{echo.user.name}, {echo.user.age}</h3>
              {echo.user.isPro && <span style={styles.proBadge}>PRO</span>}
            </div>
            <span style={styles.distance}>A {echo.distance}m de ti</span>
          </div>
          
          <button 
            style={{ ...styles.likeButton, color: liked ? '#ff4081' : 'var(--text-muted)' }} 
            onClick={handleLike}
            title="Dar Like"
          >
            {liked ? '❤️' : '🤍'}
          </button>
        </div>
        
        {!showFullProfile ? (
          <>
            <div style={styles.body}>
              <p style={styles.message}>"{echo.message}"</p>
            </div>
            <div style={styles.footer}>
              <button style={styles.secondaryButton} onClick={handleViewProfileClick}>
                Ver Perfil
              </button>
              <button style={styles.replyButton} onClick={() => onChat(echo)}>
                💬 Chatear
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.profileBody}>
              <p style={styles.bio}><strong>Bio:</strong> {echo.user.bio}</p>
              <div style={styles.tagsContainer}>
                {echo.user.interests && echo.user.interests.map((interest, idx) => (
                  <span key={idx} style={styles.tag}>{interest}</span>
                ))}
              </div>
              <p style={styles.messageLabel}>Eco actual:</p>
              <p style={styles.message}>"{echo.message}"</p>
            </div>
            <div style={styles.footer}>
              <button style={styles.secondaryButton} onClick={() => setShowFullProfile(false)}>
                Ocultar
              </button>
              <button style={styles.replyButton} onClick={() => onChat(echo)}>
                💬 Chatear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '320px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  modalExpanded: {
    width: '350px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '12px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--radar-color)',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  userName: {
    fontSize: '16px',
    margin: 0,
    color: '#fff',
  },
  proBadge: {
    backgroundColor: '#ffcf33',
    color: '#000',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '900',
  },
  distance: {
    fontSize: '12px',
    color: 'var(--radar-color)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  likeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 8px',
    transition: 'transform 0.2s',
  },
  body: {
    padding: '8px 0',
  },
  profileBody: {
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bio: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    margin: 0,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    color: 'var(--radar-color)',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    border: '1px solid var(--radar-color-dim)',
  },
  messageLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: '8px 0 0 0',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: '18px',
    fontWeight: '300',
    lineHeight: '1.4',
    fontStyle: 'italic',
    margin: 0,
  },
  footer: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  replyButton: {
    backgroundColor: 'var(--radar-color)',
    color: '#000',
    border: 'none',
    padding: '12px',
    borderRadius: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 2,
    transition: 'all 0.2s',
    boxShadow: '0 0 10px rgba(0, 255, 204, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '12px',
    borderRadius: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.2s',
  }
};

export default EchoDetailModal;
