import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Newsfeed.css';

const Newsfeed = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
      }
    };

    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reviews/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);
        } else {
          console.error('Unexpected response data format:', response.data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    checkAuth();
    fetchReviews();
  }, [navigate]);

  const handleCommentClick = (reviewId) => {
    window.location.href = `/comments/${reviewId}`;
  };

  return (
    <div className="newsfeed-container">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <i><p className="review-username">{review.user} posted a review</p></i>
            <p className="review-book"><strong>Book:</strong> {review.book_name}</p>
          </div>
          <p className="review-text">{review.review_text}</p>
          <button onClick={() => handleCommentClick(review.id)} className="comment-button">Comment</button>
        </div>
      ))}
    </div>
  );
};
export default Newsfeed;
