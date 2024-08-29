import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const handleGoToNewsfeed = () => {
    navigate('/newsfeed');
  };

  const handleGoToPeople = () => {
    navigate('/people');
  };

  const isLoggedIn = !!localStorage.getItem('token');


  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleGoToNewsfeed}>
        <h1>Bestreads</h1>
      </div>
      {isLoggedIn && <div className="navbar-buttons">
          <button onClick={handleGoToNewsfeed} className="nav-button">Reviews</button>
          <button onClick={handleGoToPeople} className="nav-button">People</button>
        </div>
      }
      {isLoggedIn && <div className="navbar-right">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      }
    </nav>
  );
};

export default Navbar;
