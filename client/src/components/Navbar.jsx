import React from 'react';
import { Sparkles, Github, ExternalLink } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-container">
                <div className="nav-brand">
                    <div className="logo">
                        <Sparkles size={24} />
                    </div>
                    <span className="brand-name">BrandCheck AI</span>
                </div>

                 

                <div className="nav-actions">
                    <a href="https://github.com/MR-Shivam-Tiwari" target="_blank" rel="noopener noreferrer" className="nav-icon-btn">
                        <Github size={20} />
                    </a>
                    <button className="btn-nav-primary">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
