import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Campus<span>Buddy</span></span>
        </Link>

        {user && (
          <div className="navbar-links">
            {user.role === 'student' && (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/teammates"
                  className={`nav-link ${isActive('/teammates') ? 'active' : ''}`}
                >
                  👥 Find Teammates
                </Link>
              </>
            )}
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>
        )}

        {user && (
          <div className="navbar-right">
            <div className="user-pill">
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user.name}</span>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout} id="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
