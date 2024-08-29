import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Newsfeed from './pages/Newsfeed';
import Comment from './pages/Comment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/newsfeed" element={<Newsfeed />} />
        <Route path="/comments/:id" element={<Comment />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
