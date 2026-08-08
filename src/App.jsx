import React, { useState, useEffect } from 'react';
import RadarBackground from './components/RadarBackground';
import EchoNode from './components/EchoNode';
import EchoDetailModal from './components/EchoDetailModal';
import BottomNav from './components/BottomNav';
import ProfileView from './components/ProfileView';
import PublicProfileView from './components/PublicProfileView';
import OnboardingScreen from './components/OnboardingScreen';
import AuthView from './components/AuthView';
import ChatModal from './components/ChatModal';
import ChatsView from './components/ChatsView';
import NotificationsModal from './components/NotificationsModal';
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2-lat1);  
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in m
}

function App() {
  const { currentUser, userData } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedEcho, setSelectedEcho] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [publicProfileUser, setPublicProfileUser] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadNotificationsCount } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const MAX_DISTANCE = 5000; // 5km
      const realEchoes = [];

      snapshot.forEach(doc => {
        if (doc.id === currentUser.uid) return; // Skip self

        const data = doc.data();
        if (!data.location || !data.location.lat) return; // Skip users without location

        let distance = 999999;
        if (userData?.location?.lat) {
          distance = getDistanceInMeters(
            userData.location.lat, userData.location.lng,
            data.location.lat, data.location.lng
          );
        }

        // Generate radar position based on distance
        // Map distance to a radius between 10 and 45
        let radiusPct = (distance / MAX_DISTANCE) * 45;
        if (radiusPct > 45) radiusPct = 45; // Cap at edge
        if (radiusPct < 5) radiusPct = 5;   // Don't spawn exactly in center

        // Use deterministic angle based on relative GPS coordinates instead of Math.random()
        // This keeps the user dot stable on the radar even if GPS fluctuates by a few meters
        let angle = 0;
        if (userData?.location?.lat && data.location?.lat) {
           angle = Math.atan2(
             data.location.lat - userData.location.lat,
             data.location.lng - userData.location.lng
           );
        }

        const x = 50 + radiusPct * Math.cos(angle);
        const y = 50 + radiusPct * Math.sin(angle); // Invert Y if you want North to be up, but standard math is fine for stability

        realEchoes.push({
          id: doc.id,
          message: data.bio ? data.bio.substring(0, 40) + '...' : '¡Hola, estoy en Radar!',
          distance: Math.round(distance),
          x, y,
          user: {
            id: doc.id,
            name: data.name,
            age: data.age || '',
            photo: data.photo || 'https://i.pravatar.cc/150',
            mainPhoto: data.photo || 'https://i.pravatar.cc/150',
            bio: data.bio || '',
            interests: data.interests || [],
            isPro: data.isPro || false,
            job: data.job || '',
            gallery: data.gallery || []
          }
        });
      });

      setEchoes(realEchoes);
    });

    return () => unsubscribe();
  }, [currentUser, userData]);

  const handleEchoClick = (echo) => setSelectedEcho(echo);
  const closeEchoDetail = () => setSelectedEcho(null);
  const handleLike = (echo, isLiked) => console.log(`Le diste like a ${echo.user.name}`);

  const handleChat = (echoOrUser) => {
    setSelectedEcho(null);
    setPublicProfileUser(null);
    // Para manejar tanto si viene desde el modal (echo) o desde la vista de perfil publico (user)
    const userToChat = echoOrUser?.user ? echoOrUser.user : echoOrUser;
    
    if (userToChat) {
      setActiveChat(userToChat);
    }
    
    setEchoes(prev => prev.map(e => {
      if (e?.user?.name && userToChat?.name && e.user.name === userToChat.name) {
        return { ...e, distance: 0, x: 50, y: 50 };
      }
      return e;
    }));
  };

  const handleViewProfile = (user) => {
    setSelectedEcho(null);
    setPublicProfileUser(user);
  };

  if (showOnboarding) {
    return <OnboardingScreen onEnter={() => setShowOnboarding(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthView onLogin={(isNew) => {
      setIsAuthenticated(true);
      if (isNew) {
        setActiveTab('perfil');
      }
    }} />;
  }

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Título flotante UI */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '6vmin', fontWeight: '900', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          RADAR <span style={{ color: 'var(--radar-color)' }}>APP</span>
        </h1>
      </div>

      {/* Botón de Notificaciones */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', position: 'relative', backdropFilter: 'blur(5px)' }}
        >
          <span style={{ fontSize: '20px' }}>🔔</span>
          {unreadNotificationsCount > 0 && (
            <div style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {unreadNotificationsCount}
            </div>
          )}
        </button>
      </div>

      {/* Modal de Notificaciones */}
      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)} 
          onOpenChat={handleChat} 
        />
      )}

      {/* Vistas según el Tab Activo */}
      {activeTab === 'radar' && (
        <RadarBackground>
          {echoes.map(echo => (
            <EchoNode key={echo.id} echo={echo} onClick={handleEchoClick} />
          ))}
        </RadarBackground>
      )}

      {/* Pestaña de Chats */}
      {activeTab === 'chats' && (
        <ChatsView onOpenChat={handleChat} />
      )}

      {activeTab === 'perfil' && <ProfileView />}

      <EchoDetailModal 
        echo={selectedEcho} 
        onClose={closeEchoDetail} 
        onLike={handleLike}
        onChat={handleChat}
        onViewProfile={handleViewProfile}
      />

      {/* Vista de Perfil Público (Full Screen) para usuarios Pro */}
      {publicProfileUser && (
        <PublicProfileView 
          user={publicProfileUser} 
          onClose={() => setPublicProfileUser(null)} 
          onChat={handleChat}
        />
      )}

      {/* Chat en tiempo real */}
      {activeChat && (
        <ChatModal user={activeChat} onClose={() => setActiveChat(null)} />
      )}

      {/* Menú de Navegación Inferior */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export default App;
