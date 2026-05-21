import React from 'react';
import { motion } from 'framer-motion';
import { FaWindows, FaApple, FaLinux, FaDownload, FaVideo, FaBrain, FaMicrophone, FaArrowLeft } from 'react-icons/fa';
import './AnimStudio.css';

const AnimStudio = ({ onBack }) => {
    const [downloading, setDownloading] = React.useState(null);

    const DOWNLOAD_LINKS = {
        windows: "/Anim-Studio-Setup.msi",
        macos: null,
        linux: null
    };

    // Dynamically switch favicon to Anim Studio branding
    React.useEffect(() => {
        const originalFavicon = document.querySelector('link[rel="icon"]')?.href;
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = '/app-studio.svg';

        return () => {
            if (favicon && originalFavicon) favicon.href = originalFavicon;
        };
    }, []);

    const handleDownload = (platform) => {
        const link = DOWNLOAD_LINKS[platform];
        if (link) {
            // Use a clean, direct approach for naming
            const downloadName = platform === 'windows' ? 'Anim-Studio-Setup.msi' : `Anim-Studio-${platform}.zip`;
            const a = document.createElement('a');
            a.href = link;
            a.setAttribute('download', downloadName);
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
            }, 100);
        } else {
            setDownloading(platform);
            setTimeout(() => setDownloading(null), 3000);
        }
    };

    const getSystemOS = () => {
        const ua = window.navigator.userAgent;
        if (ua.indexOf("Win") !== -1) return "windows";
        if (ua.indexOf("Mac") !== -1) return "macos";
        if (ua.indexOf("Linux") !== -1) return "linux";
        return "windows";
    };

    const currentOS = getSystemOS();

    return (
        <div className="anim-studio-page">
            <nav className="anim-nav">
                <button onClick={onBack} className="back-btn">
                    <FaArrowLeft /> Back to Lab
                </button>
                <div className="anim-logo">
                    <img src="/app-studio.svg" alt="Anim Studio" />
                    <span className="logo-text">Anim <span className="studio-tag">Studio</span></span>
                </div>
            </nav>

            <section className="anim-hero">
                <div className="hero-content">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="badge"
                    >
                        Pro Animation Suite
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Master the Art of <br />
                        <span className="text-gradient">Visual Storytelling</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        A powerful desktop recording and animation suite designed for engineers and creators. 
                        Capture, render, and export high-fidelity visuals with integrated FFmpeg processing.
                    </motion.p>
                    
                    <motion.div 
                        className="download-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <a 
                            href={DOWNLOAD_LINKS.windows || '#'}
                            download="Anim-Studio-Setup.msi"
                            className={`btn-download primary ${downloading === 'windows' ? 'loading' : ''} text-decoration-none`}
                            onClick={(e) => {
                                if (!DOWNLOAD_LINKS.windows) {
                                    e.preventDefault();
                                    handleDownload('windows');
                                }
                            }}
                        >
                            {downloading === 'windows' ? (
                                <span className="pulse">Verifying Build...</span>
                            ) : (
                                <><FaWindows /> {currentOS === 'windows' ? 'Download for Windows' : 'Get for Windows'}</>
                            )}
                        </a>
                        <div className="other-platforms">
                            <button 
                                className={`platform-link ${downloading === 'macos' ? 'text-warning' : ''}`}
                                onClick={() => handleDownload('macos')}
                            >
                                <FaApple /> {downloading === 'macos' ? 'Release Pending' : 'macOS'}
                            </button>
                            <button 
                                className={`platform-link ${downloading === 'linux' ? 'text-warning' : ''}`}
                                onClick={() => handleDownload('linux')}
                            >
                                <FaLinux /> {downloading === 'linux' ? 'Release Pending' : 'Linux'}
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="hero-preview">
                    <div className="preview-window glass-panel">
                        <div className="window-header">
                            <div className="dots"><span></span><span></span><span></span></div>
                            <div className="title">Anim Studio - Project_Alpha.anim</div>
                        </div>
                        <div className="window-content video-mode">
                            <video 
                                className="preview-video"
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                                poster="/app-studio.svg"
                            >
                                <source src="/videos/anim-studio-install.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-grid">
                <div className="feature-card glass-panel">
                    <FaBrain className="feature-icon" />
                    <h3>Neural Rendering</h3>
                    <p>Real-time pulsing cores and neural network visualizations for technical presentations.</p>
                </div>
                <div className="feature-card glass-panel">
                    <FaVideo className="feature-icon" />
                    <h3>4K Screen Capture</h3>
                    <p>Crystal clear screen recording with custom region selection and high-bitrate export.</p>
                </div>
                <div className="feature-card glass-panel">
                    <FaMicrophone className="feature-icon" />
                    <h3>Studio Voice</h3>
                    <p>Integrated audio engine with deep bass enhancement and real-time visualization.</p>
                </div>
            </section>

            <section className="installation-guide">
                <div className="guide-container">
                    <div className="guide-header">
                        <h2>Quick Installation</h2>
                        <p>Get up and running in minutes</p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-num">01</div>
                            <h4>Download</h4>
                            <p>Grab the latest version of Anim Studio for your operating system using the links above.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">02</div>
                            <h4>Install</h4>
                            <p>Run the installer and follow the prompts. On macOS, simply drag to your Applications folder.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">03</div>
                            <h4>Configure</h4>
                            <p>Grant the necessary permissions for camera, microphone, and screen recording when prompted.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">04</div>
                            <h4>Create</h4>
                            <p>Launch the app, choose your recording mode, and start building your visual masterpiece.</p>
                        </div>
                    </div>
                    <div className="guide-footer">
                        <a 
                            href={((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/docs?category=lab&topic=anim-studio"}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-docs"
                        >
                            View Full Documentation
                        </a>
                    </div>
                </div>
            </section>

            <section className="technical-specs">
                <div className="specs-container glass-panel">
                    <h2>Engineered for Performance</h2>
                    <div className="specs-list">
                        <div className="spec-item">
                            <span className="label">Backend</span>
                            <span className="value">Rust / Tauri</span>
                        </div>
                        <div className="spec-item">
                            <span className="label">Processing</span>
                            <span className="value">FFmpeg Core</span>
                        </div>
                        <div className="spec-item">
                            <span className="label">UI Framework</span>
                            <span className="value">React / Framer Motion</span>
                        </div>
                        <div className="spec-item">
                            <span className="label">Resolution</span>
                            <span className="value">Up to 4K Ultra HD</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="anim-footer">
                <p>&copy; {new Date().getFullYear()} Kone Lab Division. Anim Studio is an open-source project.</p>
            </footer>
        </div>
    );
};

export default AnimStudio;
