import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isTasksPage = location.pathname === '/tasks';

  return (
    <>
    
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section">
            <span className="logo-text">TaskBoard Pro</span>
          </Link>
          <div className="nav-buttons">
            {isTasksPage ? (
              <Link to="/" className="button button-secondary">
                Dashboard
              </Link>
            ) : (
              <Link to="/logout" className="button button-secondary">
                 Logout
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header; 