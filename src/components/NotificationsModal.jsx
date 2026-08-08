import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function NotificationsModal({ onClose, onOpenChat }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach(doc => notifs.push({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAllAsRead = async () => {
    if (notifications.length === 0) return;
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      });
      await batch.commit();
    } catch (e) {
      console.error('Error marking notifications as read', e);
    }
  };

  useEffect(() => {
    // Automatically mark all as read when opening the modal
    markAllAsRead();
  }, [notifications.length]);

  return (
    <div style={{
      position: 'absolute', top: '70px', right: '20px', zIndex: 1500,
      width: '90vw', maxWidth: '350px', maxHeight: '60vh', backgroundColor: 'var(--echo-bg)',
      borderRadius: '16px', border: '1px solid var(--glass-border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        padding: '16px', backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Notificaciones</h3>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ flex: 1, padding: '0', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tienes notificaciones nuevas.
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: notif.read ? 'transparent' : 'rgba(0, 255, 204, 0.05)',
                cursor: notif.type === 'message' ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (notif.type === 'message' && onOpenChat) {
                  onOpenChat({ id: notif.senderId, name: notif.senderName, photo: notif.senderPhoto });
                  onClose();
                }
              }}
            >
              <div style={{ position: 'relative' }}>
                <img src={notif.senderPhoto} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: '-4px', right: '-4px',
                  backgroundColor: notif.type === 'like' ? '#ff4081' : 'var(--radar-color)',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff'
                }}>
                  {notif.type === 'like' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000' }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  )}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>
                  <strong>{notif.senderName}</strong> {notif.type === 'like' ? 'le dio like a tu perfil' : 'te envió un mensaje'}
                </p>
                {notif.messagePreview && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {notif.messagePreview}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
