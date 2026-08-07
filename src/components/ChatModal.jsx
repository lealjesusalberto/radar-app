import { useState } from 'react';

export default function ChatModal({ user, onClose }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: `¡Hola! Vi que estás a ${user?.distanceText}`, type: 'sent' },
    { id: 2, text: '¡Hola! Sí, estoy por aquí cerca. ¿Qué tal?', type: 'received' },
  ]);

  if (!user) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setChatHistory([...chatHistory, { id: Date.now(), text: message, type: 'sent' }]);
    setMessage('');
    
    // Simulate reply
    setTimeout(() => {
      setChatHistory(prev => [...prev, { id: Date.now(), text: '¡Genial! Hablamos luego.', type: 'received' }]);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="chat-modal-content">
        <div className="chat-header">
          <button className="chat-back-btn" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="chat-user-info">
            <img src={user.photoUrl} alt={user.name} className="chat-avatar" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user.name}</h3>
          </div>
        </div>
        
        <div className="chat-messages">
          {chatHistory.map(msg => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <form className="chat-input-container" onSubmit={handleSend}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Escribe un mensaje..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
