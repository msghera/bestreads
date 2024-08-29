import React, { useState } from 'react';
import axios from 'axios';

const CommentPage = ({ match }) => {
  const [comment, setComment] = useState('');
  const reviewId = match.params.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewId}/comments`, { text: comment });
      // Handle success (e.g., show a confirmation message)
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <h1>Comment on Review {reviewId}</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentPage;
