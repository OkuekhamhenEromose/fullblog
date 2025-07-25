import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import './Blog.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('posts/');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      <h2>Latest Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <Link to={`/posts/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
          <div className="post-meta">
            <span>By {post.user.fullname}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>{post.comments_count} comments</span>
            <span>{post.likes_count} likes</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;