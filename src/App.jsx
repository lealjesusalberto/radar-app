import React, { useState, useEffect } from 'react';
import RadarBackground from './components/RadarBackground';
import EchoNode from './components/EchoNode';
import EchoDetailModal from './components/EchoDetailModal';
import BottomNav from './components/BottomNav';
import ProfileView from './components/ProfileView';
import PublicProfileView from './components/PublicProfileView';
import OnboardingScreen from './components/OnboardingScreen';
import AuthView from './components/AuthView';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedEcho, setSelectedEcho] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [publicProfileUser, setPublicProfileUser] = useState(null);
  const [echoes, setEchoes] = useState([]);

  useEffect(() => {
    const mockUsers = [
      { 
        id: 1, message: '¿Alguien para tomar un café rápido?', distance: 150,
        user: { name: 'Ana', age: 26, photo: 'https://i.pravatar.cc/150?img=1', mainPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', bio: 'Amante del buen café.', interests: ['Café', 'Tech'], isPro: false, job: 'Diseñadora', gallery: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'] }
      },
      { 
        id: 2, message: 'Recomienden un buen lugar de sushi por aquí.', distance: 350,
        user: { 
          name: 'Carlos', age: 30, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', mainPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', bio: 'Foodie empedernido. Me encanta viajar.', interests: ['Comida', 'Cine', 'Viajes'], isPro: true, job: 'Chef', gallery: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'] 
        }
      },
      { 
        id: 3, message: 'Trabajando desde el coworking.', distance: 750,
        user: { name: 'Laura', age: 28, photo: 'https://i.pravatar.cc/150?img=5', mainPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', bio: 'Desarrolladora Fullstack.', interests: ['Code', 'Startups'], isPro: false, job: 'Ingeniera de Software', gallery: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'] }
      },
      { 
        id: 4, message: 'Quiero jugar tenis a las 6pm', distance: 50,
        user: { 
          name: 'Miguel', age: 24, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', mainPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', bio: 'Deportista 24/7.', interests: ['Tenis', 'Deportes'], isPro: true, job: 'Atleta', gallery: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=400&q=80']
        }
      },
      { 
        id: 5, message: 'Paseando al perro 🐕', distance: 200,
        user: { name: 'Sofía', age: 22, photo: 'https://i.pravatar.cc/150?img=9', mainPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', bio: 'Dog lover.', interests: ['Mascotas', 'Parques'], isPro: false, job: 'Estudiante', gallery: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'] }
      },
    ];

    const MAX_DISTANCE = 1000;
    
    const initializedEchoes = mockUsers.map(echo => {
      const radiusPct = (echo.distance / MAX_DISTANCE) * 45;
      const angle = Math.random() * Math.PI * 2; 
      
      const x = 50 + radiusPct * Math.cos(angle);
      const y = 50 + radiusPct * Math.sin(angle);
      
      return { ...echo, x, y };
    });

    setEchoes(initializedEchoes);
  }, []);

  const handleEchoClick = (echo) => setSelectedEcho(echo);
  const closeEchoDetail = () => setSelectedEcho(null);
  const handleLike = (echo, isLiked) => console.log(`Le diste like a ${echo.user.name}`);

  const handleChat = (echoOrUser) => {
    setSelectedEcho(null);
    setPublicProfileUser(null);
    // Para manejar tanto si viene desde el modal (echo) o desde la vista de perfil publico (user)
    const userToChat = echoOrUser.user ? echoOrUser.user : echoOrUser;
    
    setActiveChat(userToChat);
    
    setEchoes(prev => prev.map(e => {
      if (e.user.name === userToChat.name) {
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
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Título flotante UI */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '6vmin', fontWeight: '900', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          RADAR <span style={{ color: 'var(--radar-color)' }}>APP</span>
        </h1>
      </div>

      {/* Vistas según el Tab Activo */}
      {activeTab === 'radar' && (
        <RadarBackground>
          {echoes.map(echo => (
            <EchoNode key={echo.id} echo={echo} onClick={handleEchoClick} />
          ))}
        </RadarBackground>
      )}

      {activeTab === 'chats' && (
        <div style={{ padding: '80px 20px', width: '100%', height: '100%', backgroundColor: 'var(--bg-color)', color: 'white' }}>
          <h2>Tus Chats Activos</h2>
          <p style={{ color: 'var(--text-muted)' }}>Tus conexiones recientes aparecerán aquí.</p>
          {/* Mock Lista de Chats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--echo-bg)', borderRadius: '12px' }}>
              <img src="https://i.pravatar.cc/150?img=1" alt="Ana" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--radar-color)' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>Ana</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>¡Claro! Nos vemos a las 5.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--echo-bg)', borderRadius: '12px' }}>
              <img src="https://i.pravatar.cc/150?img=12" alt="Miguel" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid transparent' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>Miguel</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Te espero en la cancha.</p>
              </div>
            </div>
          </div>
        </div>
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

      {/* Mockup Chat Móvil Responsivo */}
      {activeChat && activeTab === 'radar' && (
        <div style={{
          position: 'absolute', bottom: '85px', right: '2vmin', zIndex: 200,
          width: '90vw', maxWidth: '320px', backgroundColor: 'var(--echo-bg)',
          borderRadius: '16px', border: '1px solid var(--glass-border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}>
          <div style={{
            padding: '12px', backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={activeChat.photo} alt={activeChat.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{activeChat.name}</span>
            </div>
            <button 
              onClick={() => setActiveChat(null)} 
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: '60px 16px 12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Empieza a chatear con {activeChat.name}...
          </div>
          <div style={{ padding: '12px', display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <input 
              type="text" 
              placeholder="Escribe..." 
              style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', outline: 'none', fontSize: '14px' }}
            />
            <button style={{ background: 'var(--radar-color)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Menú de Navegación Inferior */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}

export default App;
