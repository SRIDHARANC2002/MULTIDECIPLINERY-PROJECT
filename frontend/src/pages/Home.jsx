import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Navigate Your Campus with Ease</h1>
                    <p className="hero-subtitle">
                        Find classrooms, labs, libraries, and facilities instantly with our smart navigation system.
                        Interactive maps and real-time guidance at your fingertips.
                    </p>
                    <Link to="/navigate" className="cta-button">Start Navigation 🚀</Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <div className="feature-card">
                        <div className="feature-icon">🗺️</div>
                        <h3>Interactive Maps</h3>
                        <p>Explore the entire campus layout with detailed, responsive maps.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Instant Search</h3>
                        <p>Quickly locate any department, room, or facility by name.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📍</div>
                        <h3>Route Guidance</h3>
                        <p>Get accurate directions and distance estimates to your destination.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
