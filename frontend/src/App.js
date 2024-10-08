import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Newsfeed from './pages/Newsfeed';
import Comment from './pages/Comment';
import People from './pages/People';
import Navbar from './Navbar';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/comments/:reviewId" element={<Comment />}/>
          <Route path="/people" element={<People />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
