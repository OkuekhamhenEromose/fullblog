import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to Our Blog</h1>
        <p>Discover amazing content and share your thoughts</p>
        <div className="cta-buttons">
          <Link to="/posts" className="btn primary">
            Browse Posts
          </Link>
          <Link to="/register" className="btn secondary">
            Join Now
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Our Blog</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Quality Content</h3>
            <p>Discover well-researched articles on various topics</p>
          </div>
          <div className="feature-card">
            <h3>Community</h3>
            <p>Engage with like-minded individuals</p>
          </div>
          <div className="feature-card">
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;