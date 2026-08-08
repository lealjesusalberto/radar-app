import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_USER_AVATAR } from '../utils/constants';

export default function ChatsView({ onOpenChat }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to chats where the current user is a participant
    const q = query(
      collection(db, 'chats'), 
      where('participants', 'array-contains', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeChats = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // Determine the other user's info
        const otherUserId = data.participants.find(id => id !== currentUser.uid);
        const otherUser = data.participantDetails ? data.participantDetails[otherUserId] : null;

        const otherUserPhoto = otherUser && otherUser.photo && !otherUser.photo.includes('pravatar')
          ? otherUser.photo
          : DEFAULT_USER_AVATAR;

        activeChats.push({
          id: doc.id,
          otherUserId,
          name: otherUser ? otherUser.name : 'Usuario',
          photo: otherUserPhoto,
          lastMessage: data.lastMessage || '',
          lastUpdated: data.lastUpdated ? data.lastUpdated.toMillis() : 0,
          unread: data[`unread_${currentUser.uid}`] || 0
        });
      });
      // Sort by latest message
      activeChats.sort((a, b) => b.lastUpdated - a.lastUpdated);
      setChats(activeChats);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div style={{ padding: '80px 20px', width: '100%', height: '100%', backgroundColor: 'var(--bg-color)', color: 'white', boxSizing: 'border-box', overflowY: 'auto' }}>
      <h2>Tus Chats Activos</h2>
      <p style={{ color: 'var(--text-muted)' }}>Tus conexiones recientes aparecerán aquí.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        {chats.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>No tienes chats activos. ¡Ve al Radar y saluda a alguien!</p>
        ) : (
          chats.map(chat => (
            <div 
              key={chat.id} 
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: 'var(--echo-bg)', borderRadius: '12px', cursor: 'pointer', position: 'relative' }}
              onClick={() => onOpenChat({ id: chat.otherUserId, name: chat.name, photo: chat.photo })}
            >
              <img src={chat.photo} alt={chat.name} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid transparent', objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{chat.name}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: chat.unread > 0 ? '#fff' : 'var(--text-muted)', fontWeight: chat.unread > 0 ? 'bold' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div style={{ backgroundColor: 'var(--radar-color)', color: '#000', fontSize: '12px', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {chat.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
