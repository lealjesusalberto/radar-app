import React, { useState, useEffect, useMemo } from 'react';
import RadarBackground from './components/RadarBackground';
import EchoNode from './components/EchoNode';
import ClusterNode from './components/ClusterNode';
import EchoDetailModal from './components/EchoDetailModal';
import BottomNav from './components/BottomNav';
import ProfileView from './components/ProfileView';
import PublicProfileView from './components/PublicProfileView';
import OnboardingScreen from './components/OnboardingScreen';
import AuthView from './components/AuthView';
import ChatModal from './components/ChatModal';
import ChatsView from './components/ChatsView';
import NotificationsModal from './components/NotificationsModal';
import ReloadPrompt from './components/ReloadPrompt';
import { useAuth } from './context/AuthContext';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { DEFAULT_USER_AVATAR } from './utils/constants';

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
  const { currentUser, userData, loading, unreadNotificationsCount } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('orbit_onboarding_done') !== 'true';
  });
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedEcho, setSelectedEcho] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [publicProfileUser, setPublicProfileUser] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedClusterId, setExpandedClusterId] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

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

        const userPhoto = data.photo && !data.photo.includes('pravatar')
          ? data.photo
          : DEFAULT_USER_AVATAR;

        realEchoes.push({
          id: doc.id,
          message: data.bio ? data.bio.substring(0, 40) + '...' : '¡Hola, estoy en Orbit!',
          distance: Math.round(distance),
          x, y,
          hasMatchingInterest: userData?.interests?.some(i => data.interests?.includes(i)) || false,
          user: {
            id: doc.id,
            name: data.name,
            age: data.age || '',
            photo: userPhoto,
            mainPhoto: userPhoto,
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

  const clusters = useMemo(() => {
    const CLUSTER_DISTANCE = 8; // porcentaje de distancia para agrupar
    const getDistance = (e1, e2) => Math.sqrt(Math.pow(e1.x - e2.x, 2) + Math.pow(e1.y - e2.y, 2));

    let availableEchoes = [...echoes];
    let resultClusters = [];
    
    while (availableEchoes.length > 0) {
      const current = availableEchoes.shift();
      const cluster = [current];
      
      for (let i = availableEchoes.length - 1; i >= 0; i--) {
        if (getDistance(current, availableEchoes[i]) < CLUSTER_DISTANCE) {
          cluster.push(availableEchoes.splice(i, 1)[0]);
        }
      }
      resultClusters.push(cluster);
    }
    return resultClusters;
  }, [echoes]);

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
         <img src="/orbit.png" alt="Cargando..." style={{ width: '80px', opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>
    );
  }

  if (showOnboarding && !currentUser) {
    return <OnboardingScreen onEnter={() => {
      localStorage.setItem('orbit_onboarding_done', 'true');
      setShowOnboarding(false);
    }} />;
  }

  if (!currentUser) {
    return <AuthView onLogin={(isNew) => {
      if (isNew) {
        setActiveTab('perfil');
      }
    }} />;
  }

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Título flotante UI */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <img src="/orbitapp.png" alt="Orbit Logo" style={{ height: '40px', width: 'auto', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }} />
      </div>

      {/* Botón de Notificaciones */}
      {activeTab !== 'perfil' && (
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', position: 'relative', backdropFilter: 'blur(5px)', color: 'var(--text-muted)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadNotificationsCount > 0 && (
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {unreadNotificationsCount}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Modal de Notificaciones */}
      {showNotifications && (
        <NotificationsModal 
          onClose={() => setShowNotifications(false)} 
          onOpenChat={handleChat} 
        />
      )}

      {/* Vistas según el Tab Activo */}
      {activeTab === 'radar' && (
        <>
          <div style={{ position: 'absolute', top: 80, right: 20, zIndex: 100 }}>
            <button 
              onClick={() => {
                if(isRefreshing) return;
                setIsRefreshing(true);
                setTimeout(() => setIsRefreshing(false), 1500);
              }}
              style={{ background: 'var(--radar-color)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 255, 204, 0.4)', color: '#0f172a' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}>
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          </div>
          <div style={{ width: '100%', height: '100%', opacity: isRefreshing ? 0.5 : 1, transition: 'opacity 0.3s' }} onClick={() => setExpandedClusterId(null)}>
            <RadarBackground>
              {clusters.map((cluster, clusterIndex) => {
                if (cluster.length === 1) {
                  return <EchoNode key={cluster[0].id} echo={cluster[0]} onClick={handleEchoClick} />;
                }
                
                if (expandedClusterId === clusterIndex) {
                  const radius = 12; // Radius in percentage
                  const angleStep = (2 * Math.PI) / cluster.length;
                  const cx = cluster[0].x;
                  const cy = cluster[0].y;
                  
                  return cluster.map((echo, i) => {
                    const angle = i * angleStep;
                    const expandedEcho = {
                      ...echo,
                      x: cx + radius * Math.cos(angle),
                      y: cy + radius * Math.sin(angle)
                    };
                    return (
                      <React.Fragment key={echo.id}>
                        <div style={{
                          position: 'absolute', left: `${cx}%`, top: `${cy}%`,
                          width: `${radius}%`, height: '2px', backgroundColor: 'var(--radar-color)',
                          transformOrigin: '0% 50%', transform: `rotate(${angle}rad)`, opacity: 0.3, zIndex: 10,
                          pointerEvents: 'none'
                        }} />
                        <EchoNode echo={expandedEcho} onClick={handleEchoClick} />
                      </React.Fragment>
                    );
                  });
                }
                
                return (
                  <ClusterNode 
                    key={`cluster-${clusterIndex}`}
                    count={cluster.length} 
                    x={cluster[0].x} 
                    y={cluster[0].y} 
                    onClick={() => setExpandedClusterId(clusterIndex)} 
                  />
                );
              })}
            </RadarBackground>
          </div>
        </>
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
      
      {/* PWA Update Prompt */}
      <ReloadPrompt />
    </div>
  );
}

export default App;
