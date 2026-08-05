import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { FaBars, FaTimes, FaCogs, FaMicrochip, FaCube, FaTools, FaGithub, FaDiscord, FaLinkedin, FaFacebook, FaInstagram, FaSlack, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import WorkshopLayout from './components/WorkshopLayout';
import AuthInterceptModal from './components/AuthInterceptModal';
import LoadingScreen from './components/LoadingScreen';
import InstallBanner from './components/InstallBanner';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import LabHero3D from './components/LabHero3D';
import AnimStudio from './components/AnimStudio';

function App() {
    const [isInitializing, setIsInitializing] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const { currentUser, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConstruction, setShowConstruction] = useState(false);
    const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
    const [isAnimStudioOpen, setIsAnimStudioOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Loader and session state initialization on mount
    useEffect(() => {
        const isSnap = navigator.userAgent.includes('ReactSnap');
        const hasLoaded = sessionStorage.getItem('kone_lab_loaded') === 'true';
        if (!isSnap && !hasLoaded) {
            setIsInitializing(true);
            setShowLoader(true);
        }
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('kone_lab_loaded', 'true');
        }
    }, []);

    // Inject Structured Data for Kone Lab (Top 1% SEO Practice)
    useEffect(() => {
        const SCHEMA_SCRIPT_ID = 'seo-lab-jsonld';
        let schemaScript = document.getElementById(SCHEMA_SCRIPT_ID);
        if (schemaScript) {
            schemaScript.remove();
        }

        const schemaData = [
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Kone Lab | Hardware Engineering & Prototyping",
                "url": "https://lab.koneacademy.io/",
                "parentOrganization": {
                    "@type": "Organization",
                    "name": "Kone Academy",
                    "url": "https://www.koneacademy.io/"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Kone Lab Academy",
                "description": "State-of-the-art virtual and physical engineering lab teaching microcontrollers, IoT telemetry, circuit design, and robotics.",
                "url": "https://lab.koneacademy.io/",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Accra",
                    "addressCountry": "GH"
                }
            }
        ];

        schemaScript = document.createElement('script');
        schemaScript.id = SCHEMA_SCRIPT_ID;
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.innerHTML = JSON.stringify(schemaData);
        document.head.appendChild(schemaScript);

        return () => {
            const scriptToRemove = document.getElementById(SCHEMA_SCRIPT_ID);
            if (scriptToRemove) scriptToRemove.remove();
        };
    }, []);

    // Initial check on mount
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            const pathname = window.location.pathname;
            const isWorkshopHash = hash === '#/workshop' || hash.includes('workshop') || pathname.includes('workshop');
            const isAnimStudioHash = hash === '#/anim-studio' || hash.includes('anim-studio') || pathname.includes('anim-studio');

            if (isWorkshopHash) {
                if (!loading) {
                    const isGuest = sessionStorage.getItem('kone_lab_guest') === 'true';
                    if (currentUser || isGuest) {
                        setIsWorkshopOpen(true);
                        setIsAnimStudioOpen(false);
                    } else {
                        setShowAuthModal(true);
                    }
                }
            } else if (isAnimStudioHash) {
                setIsAnimStudioOpen(true);
                setIsWorkshopOpen(false);
            } else {
                setIsWorkshopOpen(false);
                setIsAnimStudioOpen(false);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [currentUser, loading]);

    const handleEnterWorkshop = () => {
        const isGuest = sessionStorage.getItem('kone_lab_guest') === 'true';
        if (!currentUser && !isGuest) {
            setShowAuthModal(true);
        } else {
            sessionStorage.setItem('kone_workshop_active', 'true');
            window.location.hash = '#/workshop';
        }
    };

    const handleContinueAsGuest = () => {
        sessionStorage.setItem('kone_lab_guest', 'true');
        setShowAuthModal(false);
        sessionStorage.setItem('kone_workshop_active', 'true');
        window.location.hash = '#/workshop';
    };

    const handleCloseWorkshop = () => {
        sessionStorage.removeItem('kone_workshop_active');
        window.location.hash = '#/';
    };

    const handleCloseAnimStudio = () => {
        window.location.hash = '#/';
    };

    if (isAnimStudioOpen) {
        return <AnimStudio onBack={handleCloseAnimStudio} />;
    }

    return (
        <div className="app-container">
            {showLoader && (
                <LoadingScreen onFinished={() => {
                    setShowLoader(false);
                    setIsInitializing(false);
                }} />
            )}

            {!isInitializing && (
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="loading-overlay"
                            style={{
                                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                                background: '#0a0a0b', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', zIndex: 3000
                            }}
                        >
                            <div className="container" style={{ padding: '2rem', width: '100%' }}>
                                <div className="row g-4">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="col-12 col-md-4">
                                            <div style={{ height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }} className="shimmer-box" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : isWorkshopOpen ? (
                        <WorkshopLayout key="workshop" onClose={handleCloseWorkshop} />
                    ) : (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            {/* Navigation */}
                            <nav className="navbar">
                                <div className="logo">
                                    <img src="/logo-circle-blue.svg" alt="Logo" width="35" height="35" style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                    Kone Lab
                                </div>

                                <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                                </div>

                                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                                    <a href={((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/docs?category=lab"} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>Docs</a>
                                    <a href="#/anim-studio" onClick={() => setIsMenuOpen(false)}>Anim Studio</a>
                                    <div className="action-buttons">
                                        <a href={(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:3001/login' : 'https://consult.koneacademy.io/login'} className="btn-login" onClick={() => setIsMenuOpen(false)}>Login</a>
                                        <a href={(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:5173/' : 'https://www.koneacademy.io/'} className="btn-hub" onClick={() => setIsMenuOpen(false)}>Back to Hub</a>
                                    </div>
                                </div>
                            </nav>

                            {/* Main Content Area */}
                            <main id="main-content" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', width: '100%' }}>
                                {/* Hero Section */}
                                <header className="hero">
                                    <div className="hero-container">
                                        <div className="hero-text-side">
                                            <motion.h1 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6 }}
                                                className="hero-title"
                                            >
                                                BUILD THE <br /> <span className="text-gradient">PHYSICAL WORLD</span>
                                            </motion.h1>
                                            <motion.p 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.2 }}
                                                className="hero-subtitle"
                                            >
                                                Advanced engineering & hardware prototyping division.<br />
                                                <span className="text-white">Engineer the future the right way.</span>
                                            </motion.p>
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.4 }}
                                                className="hero-ctas"
                                            >
                                                <button className="btn btn-primary btn-large" onClick={handleEnterWorkshop}>
                                                    ENTER WORKSHOP
                                                </button>
                                                <a 
                                                    href={((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap') ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/training?category=lab"}
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="btn btn-secondary-outline btn-large"
                                                    style={{ 
                                                        textDecoration: 'none', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center' 
                                                    }}
                                                >
                                                    TRAINING HUB
                                                </a>
                                            </motion.div>
                                        </div>
                                        <div className="hero-animation">
                                            <LabHero3D />
                                        </div>
                                    </div>
                                </header>
                            </main>

                            <footer className="footer">
                                <div className="footer-ecosystem">
                                    <a href="https://www.koneacademy.io">Kone Academy Home</a>
                                    <a href="https://code.koneacademy.io">Kone Code</a>
                                    <a href="https://lab.koneacademy.io">Kone Lab</a>
                                    <a href="https://ai.koneacademy.io">Kone AI</a>
                                    <a href="https://consult.koneacademy.io">Kone Consult</a>
                                    <a href="https://farms.koneacademy.io">Kone Farms</a>
                                    <a href="https://kids.koneacademy.io">Kone Kids</a>
                                    <a href="https://shop.koneacademy.io">Kone Shop</a>
                                    <a href="https://warp.koneacademy.io">Kone Warp</a>
                                    <a href="https://digital.koneacademy.io">Kone Digital</a>
                                </div>
                                <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Kone Lab Division. All Rights Reserved.</p>
                                <p className="footer-sub">Hardware Engineering Branch of Kone Academy</p>
                                <div className="social-icons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                    <a href="https://x.com/koneacademy" target="_blank" rel="noreferrer" aria-label="X"><FaXTwitter /></a>
                                    <a href="https://www.tiktok.com/@koneacademy?_r=1&_t=ZM-931L3z5lu71" target="_blank" rel="noreferrer" aria-label="TikTok"><FaTiktok /></a>
                                    <a href="https://whatsapp.com/channel/0029VbDGmjg1dAvyZSw2MJ30" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
                                    <a href="https://discord.gg/Ab4SCxPgUK" target="_blank" rel="noreferrer" aria-label="Discord"><FaDiscord /></a>
                                    <a href="https://www.linkedin.com/showcase/konelab/about/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                                    <a href="https://www.facebook.com/profile.php?id=61584327765846" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
                                    <a href="https://www.instagram.com/koneacademy?igsh=bnlnaTZ5YmNsMXJ1&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                                    <a href="https://join.slack.com/t/koneacademy/shared_invite/zt-3te5lrqpj-d3gixasFIoSerlBnoQ1UMg" target="_blank" rel="noreferrer" aria-label="Slack"><FaSlack /></a>
                                    <a href="https://youtube.com/@koneacademy?si=zqEGBiiu0NRdNk6p" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
                                </div>
                            </footer>
                            <InstallBanner />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {!isInitializing && (
                <>
                    <AuthInterceptModal
                        isOpen={showAuthModal}
                        onClose={() => setShowAuthModal(false)}
                        onContinueAsGuest={handleContinueAsGuest}
                    />
                    {showConstruction && (
                        <div className="modal-overlay" onClick={() => setShowConstruction(false)} style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)'
                        }}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                className="glass-card"
                                style={{ maxWidth: '400px', width: '90%', padding: '2.5rem', textAlign: 'center', border: '1px solid #eab308' }}
                            >
                                <div style={{ color: '#eab308', fontSize: '3rem', marginBottom: '1rem' }}><FaTools /></div>
                                <h2 style={{ color: 'white' }}>Under Development</h2>
                                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '1rem 0 2rem' }}>
                                    The <strong>Kone Lab Workshop</strong> is currently being built. <br />
                                    We are engineering a state-of-the-art virtual lab and prototyping space.
                                </p>
                                <button className="btn-primary" onClick={() => setShowConstruction(false)} style={{ background: '#eab308', color: '#000', border: 'none' }}>
                                    Got it
                                </button>
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
