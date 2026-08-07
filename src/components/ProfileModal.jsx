import { useState } from 'react';

export default function ProfileModal({ user, onClose, onOpenChat }) {
  const [liked, setLiked] = useState(false);

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn glass" onClick={onClose}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="modal-image-container">
          <img src={user.photoUrl} alt={user.name} />
        </div>

        <div className="profile-details">
          <div className="profile-header">
            <div>
              <h2 className="profile-name">{user.name}</h2>
              <span className="profile-age">{user.age}</span>
            </div>
            <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
              <svg fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div className="profile-distance">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            A {user.distanceText} de ti
          </div>

          <p className="profile-bio">{user.bio}</p>

          <button className="action-btn" onClick={() => onOpenChat(user)}>
            Enviar Mensaje
          </button>
        </div>
      </div>
    </div>
  );
}
