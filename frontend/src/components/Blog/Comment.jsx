import React from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import './Comment.css';

const Comment = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = async () => {
    try {
      await API.put(`comments/${comment.id}/`, { content: editedContent });
      setIsEditing(false);
      // You might want to add a callback to refresh comments
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`comments/${comment.id}/`);
      if (onDelete) onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const canModify = user && (user.is_staff || user.email === comment.email);

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-author">
          {comment.profile_pix ? (
            <img 
              src={comment.profile_pix} 
              alt={comment.name} 
              className="comment-avatar"
            />
          ) : (
            <div className="comment-avatar-default">
              {comment.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="comment-name">{comment.name}</span>
        </div>
        <span className="comment-date">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>

      <div className="comment-body">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="comment-edit-input"
          />
        ) : (
          <p>{comment.content}</p>
        )}
      </div>

      {canModify && (
        <div className="comment-actions">
          {isEditing ? (
            <>
              <button onClick={handleEdit} className="comment-save">
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className="comment-cancel"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="comment-edit"
              >
                Edit
              </button>
              <button onClick={handleDelete} className="comment-delete">
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;