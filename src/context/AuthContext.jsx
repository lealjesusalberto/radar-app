import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // Data from Firestore
  const [loading, setLoading] = useState(true);
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);

  useEffect(() => {
    let userUnsub;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        userUnsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUserData({ id: user.uid, ...docSnap.data() });
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
        if (userUnsub) userUnsub();
      }
    });

    return () => {
      unsubscribe();
      if (userUnsub) userUnsub();
    };
  }, []);

  useEffect(() => {
    let chatsUnsub;
    if (currentUser) {
      import('firebase/firestore').then(({ collection, query, where, onSnapshot }) => {
        const q = query(
          collection(db, 'chats'), 
          where('participants', 'array-contains', currentUser.uid)
        );
        chatsUnsub = onSnapshot(q, (snapshot) => {
          let totalUnread = 0;
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data[`unread_${currentUser.uid}`]) {
              totalUnread += data[`unread_${currentUser.uid}`];
            }
          });
          setUnreadChatsCount(totalUnread);
        });
      });
    }
    return () => {
      if (chatsUnsub) chatsUnsub();
    };
  }, [currentUser]);

  useEffect(() => {
    let watchId;
    if (currentUser && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
              location: { lat: latitude, lng: longitude }
            });
            setUserData(prev => prev ? { ...prev, location: { lat: latitude, lng: longitude } } : null);
          } catch (err) {
            console.error("Error updating location:", err);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [currentUser]);

  const value = {
    currentUser,
    userData,
    loading,
    unreadChatsCount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
