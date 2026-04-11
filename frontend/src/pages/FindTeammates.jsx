import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './FindTeammates.css';

const FindTeammates = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(
    location.state?.selectedEvent || null
  );
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    if (selectedEvent) {
      fetchTeammates(selectedEvent._id);
    }
  }, [selectedEvent]);

  const fetchTeammates = async (eventId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/teammates/${eventId}`);
      setTeammates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const lookingCount = teammates.filter((t) => !t.hasTeam).length;
  const hasTeamCount = teammates.filter((t) => t.hasTeam).length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>

        <div className="page-header">
          <h1>Find Teammates 👥</h1>
          <p>Browse students interested in events and connect with potential teammates.</p>
        </div>

        <div className="teammates-layout">
          {/* Event Selector */}
          <div className="events-sidebar card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sidebar-title">Select an Event</div>
            {eventsLoading ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
              </div>
            ) : events.length === 0 ? (
              <div style={{ padding: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
                No upcoming events
              </div>
            ) : (
              <div className="event-list">
                {events.map((event) => (
                  <button
                    key={event._id}
                    id={`event-select-${event._id}`}
                    className={`event-list-item ${selectedEvent?._id === event._id ? 'active' : ''}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="eli-name">{event.eventName}</div>
                    <div className="eli-meta">
                      <span className={`badge badge-${event.type.toLowerCase()}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        {event.type}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Teammates Panel */}
          <div className="teammates-panel">
            {!selectedEvent ? (
              <div className="empty-state" style={{ flex: 1 }}>
                <div className="icon">👈</div>
                <h3>Select an event</h3>
                <p>Choose an event from the left to view interested students.</p>
              </div>
            ) : (
              <>
                <div className="tm-header card">
                  <div>
                    <h2>{selectedEvent.eventName}</h2>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                      <span className="tm-stat">
                        <span>👥</span> {teammates.length} Interested
                      </span>
                      <span className="tm-stat looking">
                        <span>🔍</span> {lookingCount} Looking
                      </span>
                      <span className="tm-stat has-team">
                        <span>🤝</span> {hasTeamCount} Has Team
                      </span>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-wrap">
                    <div className="spinner" />
                    <p style={{ color: 'var(--text-muted)' }}>Loading teammates...</p>
                  </div>
                ) : teammates.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">🫣</div>
                    <h3>No one yet</h3>
                    <p>No students have marked interest in this event yet.</p>
                  </div>
                ) : (
                  <div className="teammates-list">
                    {teammates.map((tm) => (
                      <div key={tm.id} className={`teammate-card ${!tm.hasTeam ? 'looking' : ''}`}>
                        <div className="tm-avatar">
                          {tm.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="tm-info">
                          <div className="tm-name">{tm.name}</div>
                          <div className="tm-email">
                            <span>📧</span> {tm.email}
                          </div>
                        </div>
                        <div className="tm-status">
                          {tm.hasTeam ? (
                            <span className="status-badge has-team">🤝 Has Team</span>
                          ) : (
                            <span className="status-badge looking">🔍 Looking</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTeammates;
