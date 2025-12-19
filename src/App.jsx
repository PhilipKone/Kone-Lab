import React, { useState } from 'react';
import './App.css';
import { FaBars, FaTimes, FaCogs, FaMicrochip, FaCube, FaTools, FaGithub } from 'react-icons/fa';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const modules = [
        {
            id: 'robotics',
            title: 'Robotics & Automation',
            level: 'Physical Engineering',
            icon: <FaCogs />,
            desc: 'Arduino, precision motor control, and sensor integration.',
            status: 'Active'
        },
        {
            id: '3d-design',
            title: '3D Prototyping',
            level: 'CAD & Fabrication',
            icon: <FaCube />,
            desc: 'Fusion 360 mastery and advanced additive manufacturing.',
            status: 'Open'
        },
        {
            id: 'embedded',
            title: 'Embedded Systems',
            level: 'Circuit Design',
            icon: <FaMicrochip />,
            desc: 'PCB design, soldering, and low-level firmware coding.',
            status: 'Waitlist'
        }
    ];

    return (
        <div className="app-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">
                    <img src="/logo-circle-blue.svg" alt="Logo" style={{ height: '24px', marginRight: '10px', verticalAlign: 'middle' }} />
                    Kone Lab
                </div>

                <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#modules" onClick={() => setIsMenuOpen(false)}>Workbench</a>
                    <a href="#research" onClick={() => setIsMenuOpen(false)}>Research</a>
                    <div className="action-buttons">
                        <a href="#access" className="btn-login" onClick={() => setIsMenuOpen(false)}>Lab Access</a>
                        <a href="https://www.koneacademy.io/" className="btn-hub" onClick={() => setIsMenuOpen(false)}>Back to Hub</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">BUILD THE <br /> <span className="text-gradient">PHYSICAL WORLD</span></h1>
                    <p className="hero-subtitle">
                        Advanced engineering & hardware prototyping division.<br />
                        <span className="text-white">Engineer the future the right way.</span>
                    </p>
                    <button className="btn-primary">ENTER WORKSHOP</button>
                </div>
            </header>

            {/* Modules Grid */}
            <section id="modules" className="modules-section">
                <h2 className="section-title">ENGINEERING TRACKS</h2>
                <div className="grid">
                    {modules.map(mod => (
                        <div key={mod.id} className="glass-card">
                            <div className="card-header">
                                <span className="icon">{mod.icon}</span>
                                <span className={`status ${mod.status.toLowerCase()}`}>{mod.status}</span>
                            </div>
                            <h3>{mod.title}</h3>
                            <p className="level">{mod.level}</p>
                            <p className="description">{mod.desc}</p>
                            <button className="btn-card">Initialize Project &rarr;</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2025 Kone Lab Division. All Rights Reserved.</p>
                <p className="footer-sub">Hardware Engineering Branch of Kone Academy</p>
                <div style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>
                    <a href="https://github.com/PhilipKone/Kone-Lab.git" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <FaGithub /> GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;
