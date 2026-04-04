import React from 'react';
import { motion } from 'framer-motion';

const LabHeroAnimation = () => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '1.25 / 1',
            background: 'linear-gradient(135deg, #F5F9FC 0%, #FFFFFF 100%)',
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(100,120,150,0.06)',
            margin: '0 auto',
            border: '2px solid #FFFFFF'
        }}>
            <svg viewBox="0 0 600 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E6F0F8" />
                    </linearGradient>
                    
                    <linearGradient id="robotHeadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#556999" />
                        <stop offset="100%" stopColor="#3A4B75" />
                    </linearGradient>

                    <linearGradient id="uiGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#B7E9C7" />
                        <stop offset="100%" stopColor="#FBEEAB" />
                    </linearGradient>

                    <filter id="softDepth" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                    </filter>

                    <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="10" stdDeviation="20" floodColor="#000000" floodOpacity="0.04" />
                    </filter>
                </defs>

                {/* --- AMBIENT DEPTH ELEMENTS --- */}
                <circle cx="540" cy="80" r="140" fill="#EBF3FA" opacity="0.6" filter="url(#softDepth)" />
                <circle cx="80" cy="420" r="100" fill="#F2F8FE" opacity="0.5" />

                {/* --- COLOR PALETTE RING --- */}
                <g transform="translate(190, 210)">
                    <motion.g 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                    >
                        {/* High-fidelity Pastel Segments from Reference */}
                        <path d="M 0 0 L -140 0 A 140 140 0 0 1 0 -140 Z" fill="#B7E9C7" opacity="0.45" />
                        <path d="M 0 0 L 0 -140 A 140 140 0 0 1 140 0 Z" fill="#FBEEAB" opacity="0.45" />
                        <path d="M 0 0 L 140 0 A 140 140 0 0 1 0 140 Z" fill="#F9B7C7" opacity="0.45" />
                        <path d="M 0 0 L 0 140 A 140 140 0 0 1 -140 0 Z" fill="#A7C2EB" opacity="0.45" />
                        
                        {/* Perfect Ring Hole */}
                        <circle cx="0" cy="0" r="65" fill="#F8FAFC" />
                    </motion.g>
                    {/* Glassmorphic Reflection Overlay */}
                    <circle cx="40" cy="-60" r="25" fill="white" opacity="0.4" filter="url(#softDepth)" />
                </g>

                {/* --- FLOATING TOOLBAR (Positioned BEHIND the interactive arm) --- */}
                <g transform="translate(90, 290) rotate(-3)">
                    <motion.g 
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <rect x="0" y="0" width="180" height="46" rx="23" fill="rgba(255,255,255,0.8)" filter="url(#premiumShadow)" />
                        <rect x="5" y="5" width="170" height="36" rx="18" fill="rgba(183, 233, 199, 0.2)" />
                        
                        {/* Stylized Vector Icons */}
                        <g transform="translate(35, 23)">
                            <rect x="-10" y="-12" width="6" height="24" rx="3" fill="#3B4B75" opacity="0.4" transform="rotate(30)" />
                            <circle cx="35" cy="0" r="10" fill="#3B4B75" opacity="0.6" />
                            <rect x="75" y="-10" width="20" height="20" rx="4" fill="#3B4B75" opacity="0.4" />
                            <path d="M 120 -10 L 140 10" stroke="#3B4B75" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                        </g>
                    </motion.g>
                </g>

                {/* --- ROBOT ASSISTANT (Tapered & Expressive) --- */}
                <g transform="translate(420, 280)">
                    <motion.g 
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Integrated Tapered Body & Shoulders */}
                        <path d="M -100 140 C -110 30 -90 10 0 10 C 90 10 110 30 100 140 Z" fill="url(#robotBodyGrad)" />
                        
                        {/* ACTIVE INTERACTIVE ARM (Reaching INTO the wheel in front of toolbar) */}
                        <motion.g 
                            animate={{ rotate: [-22, -30, -22], x: [0, -6, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                            transform="translate(-65, 45)"
                        >
                            {/* Joined Arm Joint */}
                            <path d="M 0 0 L -60 -40" stroke="#FFFFFF" strokeWidth="28" strokeLinecap="round" />
                            <circle cx="-60" cy="-40" r="14" fill="#3B4B75" /> {/* Hand point */}
                        </motion.g>

                        {/* PASSIVE SIDE ARM */}
                        <motion.g 
                            animate={{ rotate: [0, 8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            transform="translate(80, 80)"
                        >
                            <rect x="0" y="0" width="26" height="50" rx="13" fill="#FFFFFF" transform="rotate(-20)" />
                            <rect x="20" y="40" width="24" height="40" rx="12" fill="#3B4B75" />
                        </motion.g>

                        {/* Parameter Toggle - Sits perfectly on Belly */}
                        <motion.g transform="translate(-50, 70)">
                            <rect x="0" y="0" width="110" height="42" rx="21" fill="url(#uiGreenGrad)" opacity="0.9" />
                            <motion.circle 
                                cx="86" cy="21" r="16" fill="white" filter="url(#premiumShadow)"
                                animate={{ cx: [86, 24, 86] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.g>

                        {/* ROBOT HEAD - Tilted away & Sitting Snugly */}
                        <motion.g 
                            animate={{ rotate: [-16, -11, -16] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            transform="translate(25, -5)"
                        >
                            {/* Short, Solid Neck Connector */}
                            <rect x="-15" y="0" width="30" height="15" fill="#3B4B75" />
                            {/* Rounded Rect Head */}
                            <rect x="-75" y="-95" width="150" height="105" rx="42" fill="url(#robotHeadGrad)" filter="url(#premiumShadow)" />
                            {/* Specular Highlight */}
                            <rect x="-45" y="-82" width="90" height="12" rx="6" fill="white" opacity="0.12" />
                            
                            {/* EXACT HAPPY EYES - Wide Spacing */}
                            <motion.g animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 5 }}>
                                <path d="M -45 -45 Q -32 -60 -18 -45" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
                                <path d="M 18 -45 Q 32 -60 45 -45" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
                            </motion.g>
                        </motion.g>
                    </motion.g>
                </g>

                {/* --- BOTTOM SYSTEM CONTROLS --- */}
                <g transform="translate(60, 425)">
                    {/* Play/Pause Button */}
                    <circle cx="0" cy="0" r="36" fill="white" filter="url(#premiumShadow)" />
                    <rect x="-9" y="-14" width="7" height="28" rx="3.5" fill="#3B4B75" />
                    <rect x="9" y="-14" width="7" height="28" rx="3.5" fill="#3B4B75" />
                    
                    {/* Progress Timeline */}
                    <rect x="75" y="-5" width="450" height="10" rx="5" fill="white" opacity="0.9" />
                    <motion.rect 
                        x="75" y="-5" width="350" height="10" rx="5" fill="#F9B7C7"
                        animate={{ width: [0, 450, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                </g>
            </svg>
        </div>
    );
};

export default LabHeroAnimation;
