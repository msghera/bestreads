import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Comment = () => {
  const { reviewId } = useParams();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {

    // Fetch comments for the review
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewId}/comments`);
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

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewId}/comments`, {
        comment_text: newComment,
      },{
        headers: {
          Authorization: `Bearer ${token}`, // Include the Authorization header
        },
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div>
      {review && (
        <div className="newsfeed-container">
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
        </div>
      )}

      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.comment_text} - <em>{comment.user}</em>
          </li>
        ))}
      </ul>
      <div>
        <textarea
          value={newComment}
          onChange={handleNewCommentChange}
          placeholder="Write a comment..."
        />
        <button onClick={handlePostComment}>Post Comment</button>
      </div>
    </div>
  );
};

export default Comment;
