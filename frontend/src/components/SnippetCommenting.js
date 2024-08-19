import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const SnippetCommenting = ({ snippetId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/snippets/${snippetId}/comments`);
        setComments(res.data);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Failed to load comments', err);
      }
    };

    fetchComments();
  }, [snippetId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const res = await axios.post(`/api/snippets/${snippetId}/comments`, { content: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
      console.error('Failed to add comment', err);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment.commentId}>{comment.content}</li>
        ))}
      </ul>
      <input 
        type="text" 
        placeholder="Add a comment..." 
        value={newComment} 
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default SnippetCommenting;
