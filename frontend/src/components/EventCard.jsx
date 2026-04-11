import './EventCard.css';

const TYPE_ICONS = {
  Technical: '💻',
  Cultural: '🎭',
  Sports: '⚽',
  Workshop: '🛠️'
};

const EventCard = ({
  event,
  isInterested,
  onInterestToggle,
  onViewTeammates,
  myInterest,
  onTeamStatusChange,
  loadingId
}) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const daysLeft = Math.ceil((dateObj - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`event-card ${isInterested ? 'interested' : ''}`}>
      <div className="event-card-header">
        <span className={`badge badge-${event.type.toLowerCase()}`}>
          {TYPE_ICONS[event.type]} {event.type}
        </span>
        {daysLeft > 0 && daysLeft <= 30 && (
          <span className="days-left">{daysLeft}d left</span>
        )}
      </div>

      <h3 className="event-title">{event.eventName}</h3>

      <div className="event-meta">
        <div className="meta-item">
          <span className="meta-icon">📅</span>
          <span>{formattedDate}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🕐</span>
          <span>{formattedTime}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">📍</span>
          <span>{event.location}</span>
        </div>
        {event.createdBy && (
          <div className="meta-item">
            <span className="meta-icon">👤</span>
            <span>By {event.createdBy.name}</span>
          </div>
        )}
      </div>

      <div className="event-card-footer">
        {onInterestToggle && (
          <button
            id={`interest-btn-${event._id}`}
            className={`btn btn-sm ${isInterested ? 'btn-success' : 'btn-outline'}`}
            onClick={() => onInterestToggle(event._id)}
            disabled={loadingId === event._id}
          >
            {loadingId === event._id ? '...' : isInterested ? '✅ Interested' : '⭐ Mark Interest'}
          </button>
        )}

        {isInterested && onTeamStatusChange && (
          <div className="team-toggle">
            <button
              id={`team-has-${event._id}`}
              className={`btn btn-sm ${myInterest?.hasTeam ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onTeamStatusChange(event._id, true)}
            >
              🤝 Has Team
            </button>
            <button
              id={`team-looking-${event._id}`}
              className={`btn btn-sm ${!myInterest?.hasTeam ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onTeamStatusChange(event._id, false)}
            >
              🔍 Looking
            </button>
          </div>
        )}

        {onViewTeammates && (
          <button
            id={`teammates-btn-${event._id}`}
            className="btn btn-secondary btn-sm"
            onClick={() => onViewTeammates(event)}
          >
            👥 Teammates
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
