import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <p className="copyright">&copy; 2024 Smart Navigation System. All rights reserved.</p>

                <div className="team-section">
                    <h4 className="team-title">Project Team</h4>
                    <ul className="team-list">
                        {/* Replace these with actual team member names */}
                        <li className="team-member">Member 1 Name</li>
                        <li className="team-member">Member 2 Name</li>
                        <li className="team-member">Member 3 Name</li>
                        <li className="team-member">Member 4 Name</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
