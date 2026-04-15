import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCube, FaTools, FaCogs, FaMicrochip, FaTimes, FaSave, FaPlay, FaQuestionCircle, FaExternalLinkAlt, FaBook, FaCommentAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../firebase/utils';
import WorkshopScene from './WorkshopScene';
import ProductTour from './ProductTour';
import './Workshop.css';

const WorkshopLayout = ({ onClose }) => {
    const { currentUser } = useAuth();
    const [showHelp, setShowHelp] = useState(false);
    const [isTourOpen, setIsTourOpen] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const [components, setComponents] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sensorData, setSensorData] = useState({ acceleration: { x: 0, y: 0, z: 0 }, rotation: { alpha: 0, beta: 0, gamma: 0 } });
    const helpRef = useRef(null);
    const simulationRef = useRef(null);

    // Sensor simulation & Physical Sensor Integration
    useEffect(() => {
        logActivity(currentUser, 'Workshop Entered', { mode: currentUser ? 'loggedIn' : 'guest' });
        let isActive = true;

        const handleMotion = (event) => {
            if (!isActive) return;
            const accel = event.accelerationIncludingGravity || event.acceleration;
            if (accel) {
                setSensorData(prev => ({
                    ...prev,
                    acceleration: {
                        x: accel.x || 0,
                        y: accel.y || 0,
                        z: accel.z || 0
                    }
                }));
            }
        };

        const handleOrientation = (event) => {
            if (!isActive) return;
            setSensorData(prev => ({
                ...prev,
                rotation: {
                    alpha: event.alpha || 0,
                    beta: event.beta || 0,
                    gamma: event.gamma || 0
                }
            }));
        };

        // Simulated fallback if no hardware sensors detected
        const simulationInterval = setInterval(() => {
            if (!isActive || isIdle) return;
            // Only simulate if we're not getting real high-frequency motion
            setSensorData(prev => ({
                acceleration: {
                    x: (Math.random() - 0.5) * 0.1 + prev.acceleration.x * 0.9,
                    y: (Math.random() - 0.5) * 0.1 + prev.acceleration.y * 0.9,
                    z: (Math.random() - 0.5) * 0.1 + prev.acceleration.z * 0.9
                },
                rotation: {
                    alpha: (prev.rotation.alpha + 0.2) % 360,
                    beta: Math.sin(Date.now() / 2000) * 5,
                    gamma: Math.cos(Date.now() / 2000) * 5
                }
            }));
        }, 100);

        // Register real listeners
        window.addEventListener('devicemotion', handleMotion);
        window.addEventListener('deviceorientation', handleOrientation);

        // Permission handling for iOS
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            // Modal or user interaction usually required to trigger this
            // We'll expose this via a button if needed, but trying auto-request
        }

        return () => {
            isActive = false;
            window.removeEventListener('devicemotion', handleMotion);
            window.removeEventListener('deviceorientation', handleOrientation);
            clearInterval(simulationInterval);
        };
    }, []);

    // Handle Resize for Mobile Detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-show tour logic
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('kone_lab_tour_seen');
        if (!hasSeenTour) {
            const timer = setTimeout(() => setIsTourOpen(true), 1500);
            localStorage.setItem('kone_lab_tour_seen', 'true');
            return () => clearTimeout(timer);
        }
    }, []);

    // Idle Detection (PWA Feature)
    useEffect(() => {
        if (!('IdleDetector' in window)) return;

        let detector;
        const handleIdleChange = () => {
            if (detector.userState === 'idle') {
                setIsIdle(true);
            } else {
                setIsIdle(false);
            }
        };

        const startIdleDetection = async () => {
            try {
                const state = await IdleDetector.requestPermission();
                if (state === 'granted') {
                    detector = new window.IdleDetector();
                    detector.addEventListener('change', handleIdleChange);
                    await detector.start({ threshold: 60000 });
                }
            } catch (err) {
                console.warn("Idle Detection failed to start:", err);
            }
        };

        startIdleDetection();
        return () => {
            if (detector) {
                detector.removeEventListener('change', handleIdleChange);
            }
        };
    }, []);

    const addComponent = (type, name) => {
        const newComponent = {
            id: Date.now().toString(),
            type,
            name,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: 1,
            properties: type === 'sensor' ? { reading: 0 } : {}
        };
        setComponents([...components, newComponent]);
        setSelectedId(newComponent.id);
        logActivity(currentUser, 'Component Added', { type, name });
    };

    const updateComponent = (id, updates) => {
        setComponents(components.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const selectedComponent = components.find(c => c.id === selectedId);

    // Close help popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setShowHelp(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.div 
            className="workshop-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence>
                {isMobile && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mobile-optimized-notice"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(10, 12, 16, 0.95)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            textAlign: 'center',
                            zIndex: 10000,
                            backdropFilter: 'blur(12px)'
                        }}
                    >
                        <div style={{ color: '#58a6ff', fontSize: '4rem', marginBottom: '2rem' }}>
                            <FaCogs />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Desktop Optimized</h2>
                        <p style={{ color: '#8b949e', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '300px' }}>
                            Kone Lab Workshop is optimized for desktop. For the best experience, including 3D simulation and precise property controls, please use a desktop browser.
                        </p>
                        <button 
                            className="control-btn accent" 
                            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                            onClick={() => setIsMobile(false)} // Allow dismissing for power users
                        >
                            Continue Anyway
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header */}
            <header className="workshop-header">
                <div className="workshop-brand">
                    <img src="/logo-circle-blue.svg" alt="Logo" className="header-logo" />
                    <span className="brand-name">Kone Lab <span className="text-secondary">Workshop v1.0</span></span>
                </div>
                <div className="workshop-controls" id="workshop-controls">
                    <button className="control-btn" onClick={() => setIsTourOpen(true)} title="Quick Start Tour">
                        <FaTools /> Tour
                    </button>
                    <button className="control-btn"><FaSave /> Save</button>
                    <button 
                        className="control-btn accent" 
                        title="Simulate Workshop"
                        onClick={() => logActivity(currentUser, 'Simulation Started', { componentCount: components.length })}
                    >
                        <FaPlay /> Simulate
                    </button>
                    
                    <div className="help-menu-container" ref={helpRef}>
                        <button 
                            className={`help-toggle-btn ${showHelp ? 'active' : ''}`}
                            onClick={() => setShowHelp(!showHelp)}
                            title="Help & Resources"
                        >
                            <FaQuestionCircle />
                        </button>

                        <AnimatePresence>
                            {showHelp && (
                                <motion.div 
                                    className="help-popover"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="popover-header">Workshop Help</div>
                                    <div className="popover-content">
                                        <a 
                                            href={(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/docs?category=lab"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="popover-item"
                                        >
                                            <div className="item-icon"><FaBook /></div>
                                            <div className="item-text">
                                                <span className="item-title">Documentation</span>
                                                <span className="item-desc">Learn how to use simulation tools</span>
                                            </div>
                                            <FaExternalLinkAlt className="external-icon" />
                                        </a>

                                        <a 
                                            href={(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001' : 'https://consult.koneacademy.io') + "/contact"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="popover-item"
                                        >
                                            <div className="item-icon"><FaCommentAlt /></div>
                                            <div className="item-text">
                                                <span className="item-title">Feedback</span>
                                                <span className="item-desc">Report bugs or suggest features</span>
                                            </div>
                                            <FaExternalLinkAlt className="external-icon" />
                                        </a>
                                    </div>
                                    <div className="popover-footer">
                                        v1.0.0-beta
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="control-divider"></div>
                    <button className="control-btn" onClick={() => {
                        logActivity(currentUser, 'Workshop Exit');
                        onClose();
                    }}>
                        <FaTimes /> Back to Home
                    </button>
                </div>
            </header>

            <div className="workshop-main">
                {/* Left Sidebar - Components */}
                <aside className="workshop-sidebar left" id="component-sidebar">
                    <div className="sidebar-group">
                        <h4>Components</h4>
                        <div className="component-list">
                            <div className="component-item draggable" onClick={() => addComponent('control', 'Control Unit')}>
                                <FaMicrochip /> <span>Control Unit</span>
                            </div>
                            <div className="component-item draggable" onClick={() => addComponent('motor', 'Servo Motor')}>
                                <FaCogs /> <span>Servo Motor</span>
                            </div>
                            <div className="component-item draggable" onClick={() => addComponent('sensor', 'Sensor Pack')}>
                                <FaCube /> <span>Sensor Pack</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center - 3D Viewport */}
                <main className="workshop-content" id="workshop-scene">
                    <WorkshopScene components={components} selectedId={selectedId} onSelect={setSelectedId} onUpdate={updateComponent} isPaused={isIdle} />
                    <div className="viewport-overlay">
                        <div className="view-badge">
                            {isIdle ? 'Simulation Paused (Idle)' : `Simulation ${components.length > 0 ? 'Active' : 'Ready'}`}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Properties */}
                <aside className="workshop-sidebar right" id="properties-sidebar">
                    <div className="sidebar-group">
                        <h4>Properties</h4>
                        {selectedComponent ? (
                            <>
                                <div className="property-item">
                                    <label>Name</label>
                                    <input 
                                        type="text" 
                                        value={selectedComponent.name} 
                                        onChange={(e) => updateComponent(selectedId, { name: e.target.value })}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Position X</label>
                                    <input 
                                        type="number" 
                                        value={selectedComponent.position[0]} 
                                        step="0.1"
                                        onChange={(e) => {
                                            const pos = [...selectedComponent.position];
                                            pos[0] = parseFloat(e.target.value);
                                            updateComponent(selectedId, { position: pos });
                                        }}
                                    />
                                </div>
                                <div className="property-item">
                                    <label>Scale</label>
                                    <input 
                                        type="range" 
                                        min="0.1" 
                                        max="3" 
                                        step="0.1" 
                                        value={selectedComponent.scale} 
                                        onChange={(e) => updateComponent(selectedId, { scale: parseFloat(e.target.value) })}
                                    />
                                </div>
                                
                                {selectedComponent.type === 'sensor' && (
                                    <div className="property-item sensor-readout">
                                        <label>Live Output</label>
                                        <div className="readout-grid">
                                            <div className="readout-val">
                                                <span>X:</span> {sensorData.acceleration.x.toFixed(2)}
                                            </div>
                                            <div className="readout-val">
                                                <span>Y:</span> {sensorData.acceleration.y.toFixed(2)}
                                            </div>
                                            <div className="readout-val">
                                                <span>Z:</span> {sensorData.acceleration.z.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="property-item">
                                    <label>Status</label>
                                    <span className="badge-online">Active</span>
                                </div>
                                <button 
                                    className="btn-delete-component"
                                    onClick={() => {
                                        setComponents(components.filter(c => c.id !== selectedId));
                                        setSelectedId(null);
                                    }}
                                >
                                    Remove Component
                                </button>
                            </>
                        ) : (
                            <p className="no-selection">Select a component to view properties</p>
                        )}
                    </div>
                </aside>
            </div>

            <ProductTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
        </motion.div>
    );
};

export default WorkshopLayout;
