import React from 'react';

const PublicProfileView = ({ user, onClose, onChat }) => {
  if (!user) return null;

  return (
    <div style={styles.container}>
      
      {/* Botón flotante para volver al Radar */}
      <button style={styles.backButton} onClick={onClose}>
        ← Volver
      </button>

      {/* Header Premium con Foto Principal */}
      <div style={styles.header}>
        <div style={styles.imageOverlay}></div>
        <img src={user.mainPhoto || user.photo} alt="Foto principal" style={styles.headerImage} />
        
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            {/* Espacio para alinear el backButton si quisieramos, pero lo dejamos absoluto arriba */}
          </div>
          <div style={styles.headerBottom}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={styles.name}>{user.name}, {user.age}</h1>
              {user.isPro && <span style={styles.proBadge}>PRO</span>}
            </div>
            <p style={styles.subtitle}>{user.job || 'Usuario de Radar'}</p>
            <p style={styles.location}>📍 A {user.distance || '0'}m de ti</p>
          </div>
        </div>
      </div>

      {/* Cuerpo del Perfil */}
      <div style={styles.body}>
        
        {/* Botón Principal de Acción */}
        <button style={styles.chatButton} onClick={() => onChat(user)}>
          💬 Iniciar Conversación
        </button>

        {/* Sobre Mí */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Sobre Mí</h3>
          <p style={styles.bioText}>{user.bio}</p>
        </div>

        {/* Intereses */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Intereses</h3>
          <div style={styles.tagsContainer}>
            {user.interests && user.interests.map((interest, idx) => (
              <span key={idx} style={styles.tag}>{interest}</span>
            ))}
          </div>
        </div>

        {/* Galería de Fotos */}
        {user.gallery && user.gallery.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Galería</h3>
            <div style={styles.galleryGrid}>
              {user.gallery.map((img, idx) => (
                <div key={idx} style={styles.galleryItem}>
                  <img src={img} alt={`Gallery ${idx}`} style={styles.galleryImage} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: '40px' }}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-main)',
    overflowY: 'auto',
    zIndex: 1000, /* Por encima de todo, como pantalla completa */
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  header: {
    position: 'relative',
    height: '45vh',
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, rgba(5, 11, 20, 0.2) 0%, rgba(5, 11, 20, 1) 100%)',
    zIndex: 1,
  },
  headerContent: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 20px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
  },
  headerBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  name: {
    fontSize: '32px',
    fontWeight: '800',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  proBadge: {
    backgroundColor: '#ffcf33', // Dorado
    color: '#000',
    padding: '2px 8px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '900',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
  },
  location: {
    fontSize: '14px',
    color: 'var(--radar-color)',
    margin: '4px 0 0 0',
    fontWeight: '600',
  },
  body: {
    padding: '20px',
    position: 'relative',
    zIndex: 3,
  },
  chatButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'var(--radar-color)',
    color: '#000',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  bioText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  tag: {
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 255, 204, 0.08)',
    border: '1px solid var(--glass-border)',
    color: 'var(--radar-color)',
    fontSize: '13px',
    fontWeight: '500',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  galleryItem: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

export default PublicProfileView;
