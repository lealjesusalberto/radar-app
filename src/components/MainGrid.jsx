export default function MainGrid({ users, onSelectUser }) {
  // users here are actually 'echoes' from App.jsx
  return (
    <div className="radar-grid">
      {users.map((echo) => {
        // Format distance
        const distKm = parseFloat((echo.distance / 1000).toFixed(2));
        
        return (
          <div 
            key={echo.id} 
            className={`profile-cell ${echo.hasMatchingInterest ? 'matching-interest' : ''}`}
            onClick={() => onSelectUser(echo)}
          >
            <img src={echo.user.photo} alt={echo.user.name} />
            <div className="distance-badge">{distKm} km</div>
          </div>
        );
      })}
    </div>
  );
}
