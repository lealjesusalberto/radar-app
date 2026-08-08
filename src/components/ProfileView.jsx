import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileView = () => {
  const { userData, currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editBio, setEditBio] = useState('');
  const [editJob, setEditJob] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Usa datos reales, o el mock si userData no ha cargado completamente aún para evitar errores
  const user = userData || {
    name: 'Cargando...',
    age: '',
    bio: '',
    job: '',
    location: '',
    photo: 'https://i.pravatar.cc/150',
    gallery: [],
    interests: []
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          bio: editBio,
          job: editJob
        });
      } catch (e) {
        console.error("Error updating profile", e);
        alert("Error al guardar: " + e.message);
      }
    } else {
      // Load current values
      setEditBio(user.bio || '');
      setEditJob(user.job || '');
    }
    setIsEditing(!isEditing);
  };

  const handleAddInterest = async (e) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      const updatedInterests = [...(user.interests || []), newInterest.trim()];
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          interests: updatedInterests
        });
        setNewInterest('');
      } catch (error) {
        console.error("Error adding interest", error);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !currentUser) return;
    
    setUploadingGallery(true);
    const newGalleryUrls = [];
    
    try {
      for (const file of files) {
        const storageRef = ref(storage, `users/${currentUser.uid}/gallery_${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        newGalleryUrls.push(downloadURL);
      }
      
      const updatedGallery = [...(user.gallery || []), ...newGalleryUrls];
      await updateDoc(doc(db, 'users', currentUser.uid), {
        gallery: updatedGallery
      });
    } catch (error) {
      console.error("Error uploading to gallery", error);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    try {
      setUploading(true);
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `users/${currentUser.uid}/profile_${Date.now()}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Firestore user document
      await updateDoc(doc(db, 'users', currentUser.uid), {
        photo: downloadURL
      });
      
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Hubo un error al subir la foto.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Header Premium con Foto Principal */}
      <div style={styles.header}>
        <div style={styles.imageOverlay}></div>
        <img 
          src={user.photo} 
          alt="Foto principal" 
          style={{...styles.headerImage, opacity: uploading ? 0.5 : 1, cursor: 'pointer'}} 
          onClick={handlePhotoClick}
        />
        {uploading && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'white'}}>Subiendo...</div>}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          accept="image/*"
        />
        
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <button style={styles.iconButton}>⚙️</button>
            <button style={{...styles.iconButton, backgroundColor: isEditing ? 'var(--radar-color)' : 'rgba(255, 255, 255, 0.15)'}} onClick={handleEditToggle}>
              {isEditing ? '💾' : '✏️'}
            </button>
          </div>
          <div style={styles.headerBottom}>
            <h1 style={styles.name}>{user.name} {user.age ? `, ${user.age}` : ''}</h1>
            {isEditing ? (
              <input 
                type="text" 
                value={editJob} 
                onChange={e => setEditJob(e.target.value)} 
                placeholder="Tu profesión" 
                style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', marginTop: '4px'}} 
              />
            ) : (
              <p style={styles.subtitle}>{user.job || 'Usuario de Radar'}</p>
            )}
            <p style={styles.location}>📍 {user.location?.lat ? 'En el Radar' : 'Buscando ubicación...'}</p>
          </div>
        </div>
      </div>

      {/* Cuerpo del Perfil */}
      <div style={styles.body}>
        
        {/* Estadísticas / Ecos */}
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <span style={styles.statValue}>12</span>
            <span style={styles.statLabel}>Ecos Activos</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statBox}>
            <span style={styles.statValue}>4.5k</span>
            <span style={styles.statLabel}>Vistas</span>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statBox}>
            <span style={styles.statValue}>89</span>
            <span style={styles.statLabel}>Conexiones</span>
          </div>
        </div>

        {/* Sobre Mí */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Sobre Mí</h3>
          {isEditing ? (
            <textarea 
              value={editBio} 
              onChange={e => setEditBio(e.target.value)} 
              style={{width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px'}}
              placeholder="Cuéntanos sobre ti..."
            />
          ) : (
            <p style={styles.bioText}>{user.bio || 'Sin descripción.'}</p>
          )}
        </div>

        {/* Intereses */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Intereses</h3>
          <div style={styles.tagsContainer}>
            {user.interests && user.interests.length > 0 ? user.interests.map((interest, idx) => (
              <span key={idx} style={styles.tag}>{interest}</span>
            )) : <p style={styles.bioText}>No has añadido intereses aún.</p>}
          </div>
          {isEditing && (
            <input 
              type="text" 
              value={newInterest} 
              onChange={e => setNewInterest(e.target.value)} 
              onKeyDown={handleAddInterest}
              placeholder="Escribe un interés y presiona Enter..." 
              style={{marginTop: '12px', width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px', outline: 'none'}}
            />
          )}
        </div>

        {/* Galería de Fotos */}
        <div style={styles.section}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <h3 style={{...styles.sectionTitle, marginBottom: 0}}>Galería</h3>
            {isEditing && (
              <>
                <button onClick={() => galleryInputRef.current?.click()} style={{background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+</button>
                <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} multiple accept="image/*" style={{display: 'none'}} />
              </>
            )}
          </div>
          {uploadingGallery && <p style={{color: 'var(--radar-color)', fontSize: '12px', marginBottom: '8px'}}>Subiendo fotos a la galería...</p>}
          <div style={styles.galleryGrid}>
            {user.gallery && user.gallery.length > 0 ? user.gallery.map((img, idx) => (
              <div key={idx} style={styles.galleryItem}>
                <img src={img} alt={`Gallery ${idx}`} style={styles.galleryImage} />
              </div>
            )) : <p style={styles.bioText}>Aún no tienes fotos en tu galería.</p>}
          </div>
        </div>

        {/* Espaciador inferior para que no lo tape el menú */}
        <div style={{ height: '80px' }}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-main)',
    overflowY: 'auto',
    position: 'relative',
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
    background: 'linear-gradient(to bottom, rgba(5, 11, 20, 0.2) 0%, rgba(5, 11, 20, 0.9) 100%)',
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
    pointerEvents: 'none', // Allow clicks to pass through to the image
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px',
    pointerEvents: 'auto', // Re-enable clicks for the buttons container
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    pointerEvents: 'auto', // Re-enable clicks
  },
  headerBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    pointerEvents: 'auto', // Re-enable clicks for inputs
  },
  name: {
    fontSize: '32px',
    fontWeight: '800',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
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
    marginTop: '-20px',
    position: 'relative',
    zIndex: 3,
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--echo-bg)',
    padding: '16px 24px',
    borderRadius: '20px',
    border: '1px solid var(--glass-border)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    marginBottom: '24px',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--radar-color)',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: '1px',
    height: '30px',
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    transition: 'transform 0.3s ease',
  }
};

export default ProfileView;
