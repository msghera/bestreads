import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Newsfeed.css';

const Newsfeed = () => {
  const [reviews, setReviews] = useState([]);
  const [bookName, setBookName] = useState('');
  const [reviewText, setReviewText] = useState('');
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
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    checkAuth();
    fetchReviews();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reviews/`, {
        book_name: bookName,
        isbn: '',
        author_name: '',
        review_text: reviewText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setBookName('');
      setReviewText('');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reviews/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleCommentClick = (reviewId) => {
    window.location.href = `/comments/${reviewId}`;
  };

  return (
    <div className="newsfeed-container">
      <div className="review-form-container">
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="bookName">Book Name:</label>
            <input
              type="text"
              id="bookName"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reviewText">Review:</label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit Review</button>
        </form>
      </div>
      <div className="reviews-container">
        <h2 className="reviews-header">Book Reviews</h2>
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
    </div>
  );
};

export default Newsfeed;
