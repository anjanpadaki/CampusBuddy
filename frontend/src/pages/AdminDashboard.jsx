import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const EVENT_TYPES = ['Technical', 'Cultural', 'Sports', 'Workshop'];

const TYPE_ICONS = { Technical: '💻', Cultural: '🎭', Sports: '⚽', Workshop: '🛠️' };

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ eventName: '', type: 'Technical', date: '', location: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedEventForTeammates, setSelectedEventForTeammates] = useState(null);
  const [teammates, setTeammates] = useState([]);
  const [loadingTeammates, setLoadingTeammates] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events/all');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/events/create', form);
      setEvents((prev) => [...prev, data]);
      setForm({ eventName: '', type: 'Technical', date: '', location: '' });
      setShowModal(false);
      setFormSuccess('✅ Event created successfully!');
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Failed to create event';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setDeletingId(eventId);
    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewStudents = async (event) => {
    setSelectedEventForTeammates(event);
    setLoadingTeammates(true);
    try {
      const { data } = await api.get(`/events/teammates/${event._id}`);
      setTeammates(data);
    } catch (err) {
      alert('Failed to load students');
    } finally {
      setLoadingTeammates(false);
    }
  };

  const upcoming = events.filter((e) => new Date(e.date) >= new Date());
  const past = events.filter((e) => new Date(e.date) < new Date());

  // Today minimum for date input
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard ⚙️</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage and create campus events</p>
          </div>
          <button
            id="create-event-btn"
            className="btn btn-primary"
            onClick={() => { setShowModal(true); setFormError(''); }}
          >
            + Create Event
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="stat-icon">📅</span>
            <div>
              <div className="stat-value">{events.length}</div>
              <div className="stat-key">Total Events</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">🚀</span>
            <div>
              <div className="stat-value">{upcoming.length}</div>
              <div className="stat-key">Upcoming</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">✅</span>
            <div>
              <div className="stat-value">{past.length}</div>
              <div className="stat-key">Completed</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">🗂️</span>
            <div>
              <div className="stat-value">{EVENT_TYPES.length}</div>
              <div className="stat-key">Categories</div>
            </div>
          </div>
        </div>

        {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

        {/* Events Table */}
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No events yet</h3>
            <p>Click "Create Event" to add your first event.</p>
          </div>
        ) : (
          <div className="admin-table-wrap card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-title">
              All Events <span className="table-count">{events.length}</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const isPast = new Date(event.date) < new Date();
                    return (
                      <tr key={event._id}>
                        <td><strong>{event.eventName}</strong></td>
                        <td>
                          <span className={`badge badge-${event.type.toLowerCase()}`}>
                            {TYPE_ICONS[event.type]} {event.type}
                          </span>
                        </td>
                        <td>{new Date(event.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}</td>
                        <td>{event.location}</td>
                        <td>
                          <span className={`status-dot ${isPast ? 'past' : 'upcoming'}`}>
                            {isPast ? 'Completed' : 'Upcoming'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              id={`view-students-${event._id}`}
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleViewStudents(event)}
                            >
                              👥 Students
                            </button>
                            <button
                              id={`delete-event-${event._id}`}
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(event._id)}
                              disabled={deletingId === event._id}
                            >
                              {deletingId === event._id ? '...' : '🗑️ Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Event</h2>
              <button className="modal-close" id="close-modal-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="eventName">Event Name</label>
                <input
                  id="eventName"
                  type="text"
                  name="eventName"
                  placeholder="e.g. Hackathon 2025"
                  value={form.eventName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Event Type</label>
                <select id="type" name="type" value={form.type} onChange={handleChange}>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{TYPE_ICONS[t]} {t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Event Date & Time</label>
                <input
                  id="date"
                  type="datetime-local"
                  name="date"
                  min={`${minDate}T00:00`}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g. Main Auditorium, Block A"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  id="submit-event-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : '✨ Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Students Modal */}
      {selectedEventForTeammates && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedEventForTeammates(null); }}>
          <div className="modal" style={{ maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h2>Students Interested</h2>
              <button className="modal-close" onClick={() => setSelectedEventForTeammates(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', marginTop: '-16px' }}>
              {selectedEventForTeammates.eventName}
            </p>

            {loadingTeammates ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : teammates.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🫣</div>
                <h3>No one yet</h3>
                <p>No students have marked interest in this event yet.</p>
              </div>
            ) : (
              <div className="table-wrap" style={{ overflowY: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teammates.map(tm => (
                      <tr key={tm.id}>
                        <td><strong>{tm.name}</strong></td>
                        <td>{tm.email}</td>
                        <td>
                          {tm.hasTeam ? (
                            <span className="status-dot upcoming">🤝 Has Team</span>
                          ) : (
                            <span className="status-dot past">🔍 Looking</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
