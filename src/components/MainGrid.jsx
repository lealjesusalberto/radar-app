export default function MainGrid({ users, onSelectUser }) {
  return (
    <div className="radar-grid">
      {users.map(user => (
        <div 
          key={user.id} 
          className="profile-cell"
          onClick={() => onSelectUser(user)}
        >
          <img src={user.photoUrl} alt={user.name} />
          {user.isOnline && <div className="status-badge" title="Online"></div>}
          <div className="distance-badge">{user.distanceText}</div>
        </div>
      ))}
    </div>
  );
}
