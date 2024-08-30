import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Comment.css';

const Comment = () => {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReview(response.data.review);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [reviewId]);

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewId}/comments`, {
        comment_text: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
      window.location.reload(); // Reload the page after posting a comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="comment-container">
      {review && (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <i>
              <p className="review-username">{review.user} posted a review</p>
            </i>
            <p className="review-book">
              <strong>Book:</strong> {review.book_name}
            </p>
          </div>
          <p className="review-text">{review.review_text}</p>
        </div>
      )}
      <div className="comments-section">
        <h2>Comments</h2>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <span className="username">{comment.user}</span>: {comment.comment_text}
            </li>
          ))}
        </ul>
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={handleNewCommentChange}
            placeholder="Write a comment..."
          />
          <button onClick={handlePostComment}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
