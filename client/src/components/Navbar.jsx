import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <div className="navbar-brand-icon">📊</div>
        <span className="navbar-brand-text">AI-Powered Data Analyzer</span>
      </Link>

      <div className="navbar-right">
        {user && (
          <span className="navbar-user">
            Signed in as <span>{user.email}</span>
          </span>
        )}
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
