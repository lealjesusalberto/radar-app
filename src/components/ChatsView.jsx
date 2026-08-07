export default function ChatsView({ users, onOpenChat }) {
  // Simulate some users having recent chats
  const recentChats = users.slice(0, 8).map((user, index) => ({
    ...user,
    lastMessage: index % 3 === 0 ? '¿Qué tal todo por allá?' : '¡Hola! Qué bueno encontrarte aquí.',
    time: index === 0 ? 'Ahora' : `${index * 5}m`,
    unread: index < 2 ? index + 1 : 0
  }));

  return (
    <div className="view-container">
      <header className="app-header glass">
        <h1>Chats</h1>
      </header>
      
      <div className="chat-list">
        {recentChats.map(chat => (
          <div key={chat.id} className="chat-list-item" onClick={() => onOpenChat(chat)}>
            <div className={`chat-list-avatar-wrapper ${chat.isOnline ? 'online' : ''}`}>
              <img src={chat.photoUrl} alt={chat.name} className="chat-list-avatar" />
            </div>
            
            <div className="chat-list-content">
              <div className="chat-list-header">
                <span className="chat-list-name">{chat.name}</span>
                <span className="chat-list-time">{chat.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={`chat-list-message ${chat.unread > 0 ? 'unread' : ''}`}>
                  {chat.lastMessage}
                </span>
                {chat.unread > 0 && (
                  <span className="unread-badge">{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
