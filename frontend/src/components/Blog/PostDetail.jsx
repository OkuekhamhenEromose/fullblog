import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Comment from './Comment';
import './Blog.css';

const PostDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`posts/${id}/`),
          API.get(`posts/${id}/comments/`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Failed to fetch post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await API.post(`posts/${id}/like/`);
      setPost({
        ...post,
        likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1,
        liked: !post.liked,
      });
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await API.post(`posts/${id}/bookmark/`);
      setPost({
        ...post,
        bookmarked: !post.bookmarked,
      });
    } catch (err) {
      console.error('Bookmark failed:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await API.post(`posts/${id}/comments/`, { content: commentText });
      setComments([response.data, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="post-detail">
      <article className="post-content">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.user.fullname}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          <span>{post.category.name}</span>
        </div>
        <div className="post-image">
          {post.image && <img src={post.image} alt={post.title} />}
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="post-actions">
          <button
            onClick={handleLike}
            className={`like-button ${post.liked ? 'liked' : ''}`}
          >
            {post.liked ? 'Unlike' : 'Like'} ({post.likes_count})
          </button>
          <button
            onClick={handleBookmark}
            className={`bookmark-button ${post.bookmarked ? 'bookmarked' : ''}`}
          >
            {post.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
          </button>
        </div>
      </article>

      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>
        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        )}
        <div className="comments-list">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;