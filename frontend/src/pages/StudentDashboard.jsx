import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [myInterests, setMyInterests] = useState([]); // [{eventId, hasTeam}]
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');

  const EVENT_TYPES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop'];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, interestsRes] = await Promise.all([
        api.get('/events'),
        api.get('/events/my-interests')
      ]);
      setEvents(eventsRes.data);
      setMyInterests(interestsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isInterested = (eventId) =>
    myInterests.some((i) => i.eventId === eventId);

  const getMyInterest = (eventId) =>
    myInterests.find((i) => i.eventId === eventId);

  const handleInterestToggle = async (eventId) => {
    setLoadingId(eventId);
    try {
      const { data } = await api.post(`/events/interest/${eventId}`);
      if (data.interested) {
        setMyInterests((prev) => [...prev, { eventId, hasTeam: false }]);
        showMessage('✅ Marked as interested!');
      } else {
        setMyInterests((prev) => prev.filter((i) => i.eventId !== eventId));
        showMessage('Removed interest.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleTeamStatusChange = async (eventId, hasTeam) => {
    try {
      await api.post(`/events/team-status/${eventId}`, { hasTeam });
      setMyInterests((prev) =>
        prev.map((i) => i.eventId === eventId ? { ...i, hasTeam } : i)
      );
      showMessage(hasTeam ? '🤝 Team status: Has Team' : '🔍 Team status: Looking for team');
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const filteredEvents = filter === 'All'
    ? events
    : events.filter((e) => e.type === filter);

  const interestedCount = myInterests.length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p>Discover events, mark your interest, and find the perfect team.</p>
          </div>
          <div className="welcome-stats">
            <div className="stat-pill">
              <span className="stat-num">{events.length}</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-pill">
              <span className="stat-num">{interestedCount}</span>
              <span className="stat-label">Interested</span>
            </div>
          </div>
        </div>

        {message && <div className="alert alert-success" style={{ marginBottom: 0 }}>{message}</div>}

        {/* Filters */}
        <div className="filter-bar">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              id={`filter-${type.toLowerCase()}`}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
          <button
            id="find-teammates-shortcut"
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/teammates')}
            style={{ marginLeft: 'auto' }}
          >
            👥 Find Teammates
          </button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No events found</h3>
            <p>Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isInterested={isInterested(event._id)}
                onInterestToggle={handleInterestToggle}
                onViewTeammates={() => navigate('/teammates', { state: { selectedEvent: event } })}
                myInterest={getMyInterest(event._id)}
                onTeamStatusChange={isInterested(event._id) ? handleTeamStatusChange : null}
                loadingId={loadingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
