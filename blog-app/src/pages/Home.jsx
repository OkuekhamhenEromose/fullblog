import { useState, useEffect } from "react";
import Navbar from "../components/Common/Navbar";
import { getPosts, deletePost } from "../api/posts";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/Blog/PostForm";
import EditPostForm from "../components/Blog/EditPostForm";
import "../components/styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const truncateText = (text = "", wordLimit = 20) => {
    if (!text || typeof text !== "string") return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowPostForm(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setEditingPost(null);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete.id);
      setPosts(posts.filter((post) => post.id !== postToDelete.id));
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">WELCOME TO MY BLOG</h1>
          <p className="hero-subtitle">
            Dive into a world of creativity, insights, and inspiration. Discover
            the extraordinary in the ordinary.
          </p>
        </div>

        <div className="main-content">
          <div className="create-btn-wrapper">
            <button
              className="custom-btn"
              onClick={() => {
                setShowPostForm(!showPostForm);
                setEditingPost(null);
              }}
            >
              {showPostForm ? "Cancel" : "Create New Post"}
            </button>
          </div>

          {showPostForm && (
            <PostForm onPostCreated={handlePostCreated} onCancel={() => setShowPostForm(false)} />
          )}

          {editingPost && (
            <div className="edit-form-wrapper">
              <EditPostForm
                post={editingPost}
                onUpdate={handlePostUpdated}
                onCancel={() => setEditingPost(null)}
              />
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : posts.length === 0 ? (
            <p className="no-posts-msg">No posts available. Be the first to create one!</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div className="post-card" key={post.id}>
                  <div className="post-header">
                    <div>
                      <h3>{post.title}</h3>
                      <p className="category">Category: {post.category_name}</p>
                    </div>
                    {post.is_owner && (
                      <div className="icon-wrapper">
                        <span
                          className="icon edit-icon"
                          onClick={() => setEditingPost(post)}
                          title="Edit"
                        >
                          ✏️
                        </span>
                        <span
                          className="icon delete-icon"
                          onClick={() => handleDeleteClick(post)}
                          title="Delete"
                        >
                          🗑️
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="post-content">
                    <p>{truncateText(post.content)}</p>
                  </div>
                  <div className="post-footer">
                    <small>{new Date(post.created_at).toLocaleDateString()}</small>
                    <button
                      className="read-more-btn"
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Simple Delete Confirmation Modal */}
        {deleteDialogOpen && (
          <div className="delete-dialog-overlay">
            <div className="delete-dialog">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="dialog-buttons">
                <button onClick={handleCancelDelete} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleConfirmDelete} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
