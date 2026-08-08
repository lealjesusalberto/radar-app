import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc, increment } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_USER_AVATAR } from '../utils/constants';

export default function ChatModal({ user, onClose }) {
  const { currentUser, userData } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const chatId = currentUser.uid < user.id ? `${currentUser.uid}_${user.id}` : `${user.id}_${currentUser.uid}`;

  useEffect(() => {
    if (!currentUser || !user) return;

    // Reset unread count when opening the chat
    setDoc(doc(db, 'chats', chatId), {
      [`unread_${currentUser.uid}`]: 0
    }, { merge: true }).catch(console.error);

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId, currentUser, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;
    
    const text = message;
    setMessage('');

    try {
      // Add message
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
      });

      const myPhoto = userData?.photo && !userData.photo.includes('pravatar')
        ? userData.photo
        : DEFAULT_USER_AVATAR;

      // Update chat metadata and increment unread for the OTHER user
      await setDoc(doc(db, 'chats', chatId), {
        participants: [currentUser.uid, user.id],
        participantDetails: {
           [currentUser.uid]: { name: userData?.name || 'Yo', photo: myPhoto },
           [user.id]: { name: user.name, photo: user.photo }
        },
        lastMessage: text,
        lastUpdated: serverTimestamp(),
        [`unread_${user.id}`]: increment(1),
        [`unread_${currentUser.uid}`]: 0 // Reset my own just in case
      }, { merge: true });

      // Add to global notifications collection
      await addDoc(collection(db, 'notifications'), {
        recipientId: user.id,
        senderId: currentUser.uid,
        senderName: userData?.name || 'Alguien',
        senderPhoto: myPhoto,
        type: 'message',
        messagePreview: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
        read: false,
        timestamp: serverTimestamp()
      });
      
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  if (!user) return null;

  return (
    <div style={{
      position: 'absolute', bottom: '85px', right: '50%', transform: 'translateX(50%)', zIndex: 2000,
      width: '90vw', maxWidth: '400px', height: '60vh', minHeight: '350px', backgroundColor: 'var(--echo-bg)',
      borderRadius: '16px', border: '1px solid var(--glass-border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        padding: '12px', backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={user.photo || user.photoUrl} alt={user.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>{user.name}</span>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.length === 0 ? (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
            Empieza a chatear con {user.name}...
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ 
              alignSelf: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
              background: msg.senderId === currentUser.uid ? 'var(--radar-color)' : 'rgba(255,255,255,0.1)',
              color: msg.senderId === currentUser.uid ? '#000' : '#fff',
              padding: '8px 12px',
              borderRadius: '12px',
              maxWidth: '80%',
              fontSize: '14px'
            }}>
              {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ padding: '12px', display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <input 
          type="text" 
          placeholder="Escribe..." 
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', fontSize: '14px' }}
        />
        <button type="submit" style={{ background: 'var(--radar-color)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000' }}>
          ➤
        </button>
      </form>
    </div>
  );
}
