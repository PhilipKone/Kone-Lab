import React from 'react';

// Highly-detailed, ultra-realistic SVG icons matching the physical hardware components

// Arduino Uno Icon
export const ArduinoUnoIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="pcbGreenGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#104a35" />
                <stop offset="100%" stopColor="#082b1e" />
            </linearGradient>
            <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e0e0e0" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#9a9a9a" />
            </linearGradient>
        </defs>
        {/* PCB Board */}
        <rect x="5" y="10" width="90" height="80" rx="8" fill="url(#pcbGreenGrad)" stroke="#165940" strokeWidth="1.5" />
        
        {/* USB Connector */}
        <rect x="2" y="20" width="22" height="18" rx="2" fill="url(#metalGrad)" stroke="#666" strokeWidth="0.5" />
        <rect x="0" y="24" width="2" height="10" fill="#222" />
        
        {/* Power Jack */}
        <rect x="2" y="60" width="24" height="20" rx="3" fill="#111" />
        <circle cx="26" cy="70" r="4" fill="#333" />
        <circle cx="26" cy="70" r="2" fill="#555" />
        
        {/* IC Atmega Chip */}
        <rect x="42" y="32" width="46" height="14" rx="1" fill="#1e1e1e" stroke="#000" strokeWidth="1" />
        {/* Pins */}
        {[...Array(14)].map((_, i) => {
            const xOffset = 45 + i * 3;
            return (
                <g key={i}>
                    <line x1={xOffset} y1="30" x2={xOffset} y2="32" stroke="#d1d1d1" strokeWidth="0.8" />
                    <line x1={xOffset} y1="46" x2={xOffset} y2="48" stroke="#d1d1d1" strokeWidth="0.8" />
                </g>
            );
        })}
        {/* Dot on chip */}
        <circle cx="44.5" cy="39" r="1" fill="#444" />
        
        {/* Black Headers */}
        {/* Top Header */}
        <rect x="35" y="14" width="55" height="6" rx="1" fill="#1a1a1a" />
        {[...Array(10)].map((_, i) => (
            <rect key={i} x={37 + i * 5.2} y="15.5" width="2.5" height="3" fill="#000" stroke="#ffd700" strokeWidth="0.3" />
        ))}
        {/* Bottom Header */}
        <rect x="35" y="80" width="55" height="6" rx="1" fill="#1a1a1a" />
        {[...Array(10)].map((_, i) => (
            <rect key={i} x={37 + i * 5.2} y="81.5" width="2.5" height="3" fill="#000" stroke="#ffd700" strokeWidth="0.3" />
        ))}

        {/* Silkscreen detailing */}
        <path d="M 32 25 L 32 75 M 32 50 L 38 50" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
        <circle cx="85" cy="24" r="1.5" fill="#39ff14" opacity="0.8" /> {/* ON LED */}
        <text x="76" y="25" fill="#fff" fontSize="4" fontFamily="sans-serif" opacity="0.6">ON</text>
    </svg>
);

// ESP32 NodeMCU Icon
export const ESP32Icon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="pcbBlackGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1e24" />
                <stop offset="100%" stopColor="#0d0d11" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe494" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d5d5d8" />
                <stop offset="50%" stopColor="#f3f3f5" />
                <stop offset="100%" stopColor="#b4b4b8" />
            </linearGradient>
        </defs>
        {/* PCB Board */}
        <rect x="22" y="5" width="56" height="90" rx="6" fill="url(#pcbBlackGrad)" stroke="#2b2b35" strokeWidth="1.5" />
        
        {/* Gold Headers (Pins Side Left & Right) */}
        {[...Array(15)].map((_, i) => {
            const yOffset = 10 + i * 5.3;
            return (
                <g key={i}>
                    {/* Left Header socket */}
                    <rect x="18" y={yOffset} width="5" height="3.5" rx="0.5" fill="url(#goldGrad)" />
                    {/* Right Header socket */}
                    <rect x="77" y={yOffset} width="5" height="3.5" rx="0.5" fill="url(#goldGrad)" />
                </g>
            );
        })}
        
        {/* ESP32 WROOM RF Shield */}
        <rect x="33" y="32" width="34" height="28" rx="2" fill="url(#shieldGrad)" stroke="#9c9ca0" strokeWidth="0.8" />
        {/* Laser engravings representation */}
        <rect x="37" y="36" width="26" height="2" fill="#6c6c70" opacity="0.8" />
        <rect x="37" y="41" width="22" height="1.5" fill="#6c6c70" opacity="0.8" />
        <rect x="37" y="45" width="18" height="1.5" fill="#6c6c70" opacity="0.8" />
        <rect x="37" y="49" width="24" height="1.5" fill="#6c6c70" opacity="0.8" />
        
        {/* Golden PCB Wi-Fi Antenna */}
        <path d="M 33 8 L 33 22 H 67 V 8 H 63 V 18 H 59 V 8 H 55 V 18 H 51 V 8 H 47 V 18 H 43 V 8 H 39 V 18 H 35 V 8 Z" fill="url(#goldGrad)" />
        
        {/* Boot & EN Push-Buttons */}
        <rect x="30" y="82" width="8" height="8" rx="1.5" fill="#151515" stroke="#444" strokeWidth="0.5" />
        <circle cx="34" cy="86" r="2" fill="url(#shieldGrad)" />
        
        <rect x="62" y="82" width="8" height="8" rx="1.5" fill="#151515" stroke="#444" strokeWidth="0.5" />
        <circle cx="66" cy="86" r="2" fill="url(#shieldGrad)" />

        {/* CP2102 chip */}
        <rect x="44" y="68" width="12" height="10" rx="0.5" fill="#2a2a2a" />
        
        {/* USB Micro Connector */}
        <rect x="42" y="90" width="16" height="6" rx="1.5" fill="url(#shieldGrad)" stroke="#444" strokeWidth="0.5" />
    </svg>
);

// Servo Motor SG90 Icon
export const ServoMotorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="servoBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0080ff" />
                <stop offset="60%" stopColor="#005cbd" />
                <stop offset="100%" stopColor="#003d7c" />
            </linearGradient>
            <linearGradient id="plasticWhite" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#eeeeee" />
                <stop offset="100%" stopColor="#cccccc" />
            </linearGradient>
        </defs>
        {/* 3-Wire Servo cable Ribbon */}
        <path d="M 50 78 L 50 100 M 47 78 L 47 100 M 53 78 L 53 100" stroke="#d47c11" strokeWidth="2.5" opacity="0.8" /> {/* Orange/Brown Ribbon */}
        <path d="M 50 78 L 50 100" stroke="#d41111" strokeWidth="2.5" /> {/* Red Ribbon */}
        
        {/* Mounting Ears / Side Flange */}
        <rect x="15" y="44" width="70" height="8" rx="2" fill="url(#servoBlue)" opacity="0.95" />
        <circle cx="21" cy="48" r="2.5" fill="#111" />
        <circle cx="79" cy="48" r="2.5" fill="#111" />
        
        {/* Main Blue Body */}
        <rect x="28" y="24" width="44" height="54" rx="4" fill="url(#servoBlue)" stroke="#004d9c" strokeWidth="0.8" />
        <rect x="32" y="27" width="36" height="15" fill="#004d9c" opacity="0.3" rx="1" />
        
        {/* Gear Top Cap */}
        <circle cx="58" cy="24" r="10" fill="url(#servoBlue)" />
        <circle cx="58" cy="24" r="6" fill="url(#plasticWhite)" />
        
        {/* White Multi-horn Arm */}
        <g style={{ transformOrigin: '58px 24px', transform: 'rotate(15deg)' }}>
            <rect x="25" y="20" width="66" height="8" rx="4" fill="url(#plasticWhite)" stroke="#bbb" strokeWidth="0.5" />
            <circle cx="58" cy="24" r="7" fill="url(#plasticWhite)" stroke="#999" strokeWidth="0.5" />
            <circle cx="58" cy="24" r="2" fill="#555" />
            {/* Horn holes */}
            <circle cx="31" cy="24" r="1.2" fill="#444" />
            <circle cx="39" cy="24" r="1.2" fill="#444" />
            <circle cx="47" cy="24" r="1.2" fill="#444" />
            <circle cx="69" cy="24" r="1.2" fill="#444" />
            <circle cx="77" cy="24" r="1.2" fill="#444" />
            <circle cx="85" cy="24" r="1.2" fill="#444" />
        </g>
    </svg>
);

// 0.96" OLED I2C Display Icon
export const OLEDDisplayIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="pcbBlueGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#082b4b" />
                <stop offset="100%" stopColor="#041525" />
            </linearGradient>
            <linearGradient id="screenGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#151c24" />
                <stop offset="100%" stopColor="#080c10" />
            </linearGradient>
        </defs>
        {/* PCB Board */}
        <rect x="8" y="12" width="84" height="76" rx="5" fill="url(#pcbBlueGrad)" stroke="#0e3d67" strokeWidth="1.5" />
        
        {/* Four Golden Header Pins at the Top */}
        {[...Array(4)].map((_, i) => {
            const xOffset = 38 + i * 8;
            return (
                <g key={i}>
                    <rect x={xOffset} y="5" width="4" height="7" rx="0.5" fill="#ffe494" stroke="#d4af37" strokeWidth="0.3" />
                    <rect x={xOffset + 1} y="12" width="2" height="4" fill="#d4af37" />
                </g>
            );
        })}
        {/* Header Black Plastic Housing */}
        <rect x="34" y="9" width="32" height="4" fill="#222" rx="0.5" />
        
        {/* Mount holes */}
        <circle cx="14" cy="18" r="3.5" fill="#f0f0f2" stroke="#222" strokeWidth="0.8" />
        <circle cx="86" cy="18" r="3.5" fill="#f0f0f2" stroke="#222" strokeWidth="0.8" />
        <circle cx="14" cy="82" r="3.5" fill="#f0f0f2" stroke="#222" strokeWidth="0.8" />
        <circle cx="86" cy="82" r="3.5" fill="#f0f0f2" stroke="#222" strokeWidth="0.8" />

        {/* OLED Glass Screen */}
        <rect x="14" y="26" width="72" height="52" rx="3" fill="url(#screenGlass)" stroke="#222" strokeWidth="1.5" />
        
        {/* Simulated Yellow Top Screen Section */}
        <rect x="18" y="30" width="64" height="10" fill="#000" rx="1" />
        <text x="21" y="38" fill="#ffd700" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">KONE LAB v1.3</text>
        <circle cx="78" cy="35" r="2.5" fill="#ffd700" opacity="0.8" />
        <circle cx="78" cy="35" r="1.2" fill="#000" />
        
        {/* Simulated Cyan Bottom Screen Section */}
        <rect x="18" y="43" width="64" height="30" fill="#000" rx="1" />
        {/* Wave graphic */}
        <path d="M 22 68 Q 28 50, 34 68 T 46 68 T 58 55 T 70 68" stroke="#00e5ff" strokeWidth="1.5" fill="none" opacity="0.95" />
        
        {/* Text lines */}
        <text x="21" y="52" fill="#00e5ff" fontSize="6.5" fontFamily="monospace" opacity="0.8">SYSTEM: OK</text>
        <text x="21" y="60" fill="#00e5ff" fontSize="6.5" fontFamily="monospace" opacity="0.8">I2C: 0x3C</text>
    </svg>
);

// DHT11 Temp & Humidity Sensor Icon
export const DHT11SensorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="sensorCyan" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00bcd4" />
                <stop offset="60%" stopColor="#00acc1" />
                <stop offset="100%" stopColor="#00838f" />
            </linearGradient>
        </defs>
        {/* Black Backing Board */}
        <rect x="18" y="5" width="64" height="90" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        
        {/* Three Golden Sensor Leads at the Bottom */}
        <line x1="38" y1="85" x2="38" y2="98" stroke="#ffe494" strokeWidth="2.5" />
        <line x1="50" y1="85" x2="50" y2="98" stroke="#ffe494" strokeWidth="2.5" />
        <line x1="62" y1="85" x2="62" y2="98" stroke="#ffe494" strokeWidth="2.5" />

        {/* Slotted Blue Shell Case */}
        <rect x="22" y="10" width="56" height="70" rx="5" fill="url(#sensorCyan)" stroke="#0097a7" strokeWidth="1.2" />
        
        {/* Grid Slits (The DHT11 mesh ventilation system) */}
        {[...Array(4)].map((_, i) => {
            const yOffset = 20 + i * 14;
            return (
                <g key={i}>
                    <rect x="28" y={yOffset} width="44" height="4" rx="1.5" fill="#006064" />
                    <rect x="32" y={yOffset + 1} width="36" height="2" rx="1" fill="#111" opacity="0.7" />
                </g>
            );
        })}
        {/* Humidity label */}
        <text x="50" y="74" fill="#004d40" fontSize="5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" opacity="0.6">DHT11</text>
    </svg>
);

// Solderless Breadboard Icon
export const BreadboardIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="breadboardBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f5f5f7" />
            </linearGradient>
        </defs>
        {/* Board Body */}
        <rect x="5" y="18" width="90" height="64" rx="6" fill="url(#breadboardBody)" stroke="#e1e1e4" strokeWidth="1.5" />
        
        {/* Central gutter slot */}
        <rect x="8" y="48" width="84" height="4" fill="#cdccd1" rx="0.5" />

        {/* Red & Blue Power Rails */}
        {/* Top Rails */}
        <line x1="12" y1="23" x2="88" y2="23" stroke="#ff3333" strokeWidth="1" />
        <line x1="12" y1="28" x2="88" y2="28" stroke="#0066cc" strokeWidth="1" />
        {/* Bottom Rails */}
        <line x1="12" y1="72" x2="88" y2="72" stroke="#ff3333" strokeWidth="1" />
        <line x1="12" y1="77" x2="88" y2="77" stroke="#0066cc" strokeWidth="1" />

        {/* Prototyping Holes (Grid Grid Points) */}
        {/* Top Section columns (5 rows) */}
        {[...Array(16)].map((_, col) => {
            const x = 12 + col * 5.0;
            return (
                <g key={`top-${col}`}>
                    {[...Array(4)].map((_, row) => {
                        const y = 33 + row * 3.5;
                        return <circle key={row} cx={x} cy={y} r="0.8" fill="#444" />;
                    })}
                </g>
            );
        })}
        
        {/* Bottom Section columns (5 rows) */}
        {[...Array(16)].map((_, col) => {
            const x = 12 + col * 5.0;
            return (
                <g key={`bot-${col}`}>
                    {[...Array(4)].map((_, row) => {
                        const y = 55 + row * 3.5;
                        return <circle key={row} cx={x} cy={y} r="0.8" fill="#444" />;
                    })}
                </g>
            );
        })}

        {/* Visual labels */}
        <text x="50" y="44" fill="#a0a0a5" fontSize="4.5" textAnchor="middle" fontFamily="sans-serif">SOLDERLESS BREADBOARD</text>
    </svg>
);

// RGB LED Icon
export const LEDIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="ledRedGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="50%" stopColor="#ff1a1a" />
                <stop offset="100%" stopColor="#b30000" />
            </linearGradient>
            <radialGradient id="ledGlow" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
            </radialGradient>
        </defs>
        {/* Metallic Leads */}
        <path d="M 42 62 L 42 98" stroke="#dcdcdc" strokeWidth="2.5" strokeLinecap="round" /> {/* Cathode */}
        <path d="M 58 62 L 58 75 L 62 82 L 62 98" fill="none" stroke="#dcdcdc" strokeWidth="2.5" strokeLinecap="round" /> {/* Bent Anode */}

        {/* LED Plastic Rim Base */}
        <path d="M 32 62 C 32 58, 68 58, 68 62 Z" fill="url(#ledRedGrad)" stroke="#990000" strokeWidth="0.5" />
        <rect x="32" y="58" width="36" height="4" fill="url(#ledRedGrad)" />

        {/* LED Dome Body */}
        <rect x="34" y="30" width="32" height="28" fill="url(#ledRedGrad)" />
        <circle cx="50" cy="30" r="16" fill="url(#ledRedGrad)" />

        {/* Internal Anvil Frame */}
        <path d="M 42 46 L 42 58 M 42 46 L 38 42 L 38 36 L 46 36 L 46 42 Z" fill="#b0b0b0" stroke="#888" strokeWidth="0.5" />
        {/* Internal Post Frame */}
        <line x1="58" y1="58" x2="58" y2="40" stroke="#b0b0b0" strokeWidth="1.2" />

        {/* Sleek Lens Highlight / Glow */}
        <circle cx="50" cy="35" r="12" fill="url(#ledGlow)" />
        <ellipse cx="44" cy="24" rx="4" ry="2" fill="#fff" opacity="0.6" transform="rotate(-30, 44, 24)" />
    </svg>
);

// 220 Ohm Striped Resistor Icon
export const ResistorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="leadMetal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cccccc" />
                <stop offset="50%" stopColor="#f5f5f5" />
                <stop offset="100%" stopColor="#999999" />
            </linearGradient>
            <linearGradient id="resistorTan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fad7a0" />
                <stop offset="40%" stopColor="#f5c07a" />
                <stop offset="100%" stopColor="#cca162" />
            </linearGradient>
        </defs>
        {/* Resistor Wire Leads */}
        <rect x="5" y="48" width="90" height="4" fill="url(#leadMetal)" rx="1.5" />
        
        {/* Body Outline (Dumbbell shape / Rounded Cylinder) */}
        <rect x="25" y="32" width="50" height="36" rx="10" fill="url(#resistorTan)" stroke="#cd8e3b" strokeWidth="0.8" />
        <rect x="30" y="35" width="40" height="30" fill="url(#resistorTan)" />

        {/* 220 Ohm Bands: Red, Red, Brown, Gold */}
        {/* Band 1: Red (2) */}
        <rect x="34" y="33" width="4" height="34" fill="#ff3333" />
        {/* Band 2: Red (2) */}
        <rect x="42" y="35" width="4" height="30" fill="#ff3333" />
        {/* Band 3: Brown (x10) */}
        <rect x="50" y="35" width="4" height="30" fill="#8b5a2b" />
        
        {/* Space */}
        
        {/* Band 4: Gold (5% Tolerance) */}
        <rect x="62" y="33" width="4" height="34" fill="#d4af37" />

        {/* Visual shadow details */}
        <rect x="25" y="32" width="50" height="4" fill="#ffffff" opacity="0.35" />
        <rect x="25" y="64" width="50" height="4" fill="#000000" opacity="0.2" />
    </svg>
);

// Sensor Pack (Ultrasonic hc-sr04) Icon
export const SensorPackIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="pcbTealGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#004d40" />
                <stop offset="100%" stopColor="#002d24" />
            </linearGradient>
            <linearGradient id="transducerGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#eaeaea" />
                <stop offset="60%" stopColor="#cccccc" />
                <stop offset="100%" stopColor="#999999" />
            </linearGradient>
        </defs>
        {/* PCB Board */}
        <rect x="5" y="24" width="90" height="52" rx="4" fill="url(#pcbTealGrad)" stroke="#00796b" strokeWidth="1.2" />
        
        {/* Crystal oscillator (Silver block) */}
        <rect x="42" y="48" width="16" height="8" rx="2" fill="#c0c0c0" stroke="#777" strokeWidth="0.5" />
        
        {/* Left Sensor Transducer Cylinder (T) */}
        <circle cx="28" cy="50" r="19" fill="url(#transducerGrad)" stroke="#555" strokeWidth="0.8" />
        <circle cx="28" cy="50" r="14" fill="#111" />
        {/* Mesh filter */}
        <circle cx="28" cy="50" r="13" fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3,1.5" />
        <text x="28" y="52" fill="#e0e0e0" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" opacity="0.6">T</text>

        {/* Right Sensor Transducer Cylinder (R) */}
        <circle cx="72" cy="50" r="19" fill="url(#transducerGrad)" stroke="#555" strokeWidth="0.8" />
        <circle cx="72" cy="50" r="14" fill="#111" />
        {/* Mesh filter */}
        <circle cx="72" cy="50" r="13" fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3,1.5" />
        <text x="72" y="52" fill="#e0e0e0" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" opacity="0.6">R</text>

        {/* 4 Header Pins at the bottom */}
        <line x1="38" y1="76" x2="38" y2="88" stroke="#ffe494" strokeWidth="2" />
        <line x1="46" y1="76" x2="46" y2="88" stroke="#ffe494" strokeWidth="2" />
        <line x1="54" y1="76" x2="54" y2="88" stroke="#ffe494" strokeWidth="2" />
        <line x1="62" y1="76" x2="62" y2="88" stroke="#ffe494" strokeWidth="2" />
        <rect x="34" y="74" width="32" height="4" fill="#222" rx="0.5" />
    </svg>
);

// Potentiometer Icon (Rotary dial with three solder lugs)
export const PotentiometerIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="metalCase" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d5d5d8" stopOpacity="1" />
                <stop offset="100%" stopColor="#78787c" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="knobBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#444" stopOpacity="1" />
                <stop offset="100%" stopColor="#111" stopOpacity="1" />
            </linearGradient>
        </defs>
        {/* Three Solder Lugs (Pins) at the bottom */}
        <path d="M 32 72 L 32 95 M 50 72 L 50 95 M 68 72 L 68 95" stroke="#c0c0c5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="93" r="1.5" fill="#444" />
        <circle cx="50" cy="93" r="1.5" fill="#444" />
        <circle cx="68" cy="93" r="1.5" fill="#444" />

        {/* Terminals backing block */}
        <rect x="25" y="66" width="50" height="8" fill="#a0522d" rx="1" />

        {/* Circular metal pot casing */}
        <circle cx="50" cy="45" r="28" fill="url(#metalCase)" stroke="#5d5d60" strokeWidth="1" />
        <circle cx="50" cy="45" r="23" fill="#eaeaea" stroke="#aaa" strokeWidth="0.5" />

        {/* Rotary center shaft and knob */}
        <circle cx="50" cy="45" r="15" fill="url(#knobBlue)" stroke="#000" strokeWidth="1.2" />
        {/* Shaft white indicator stripe */}
        <line x1="50" y1="45" x2="50" y2="32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

// Ceramic / Electrolytic Capacitor Icon
export const CapacitorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="capCan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#333" />
                <stop offset="50%" stopColor="#555" />
                <stop offset="100%" stopColor="#111" />
            </linearGradient>
        </defs>
        {/* Leads */}
        <line x1="42" y1="62" x2="42" y2="98" stroke="#dcdcdc" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="58" y1="62" x2="58" y2="92" stroke="#dcdcdc" strokeWidth="2.2" strokeLinecap="round" />

        {/* Electrolytic Can Body (Black Cylinder) */}
        <rect x="30" y="10" width="40" height="52" rx="4" fill="url(#capCan)" stroke="#000" strokeWidth="1" />
        
        {/* Negative stripe (Grey column on left side) */}
        <rect x="32" y="10" width="8" height="52" fill="#d1d1d6" opacity="0.9" />
        <text x="36" y="24" fill="#333" fontSize="8" fontWeight="bold" textAnchor="middle">-</text>
        <text x="36" y="44" fill="#333" fontSize="8" fontWeight="bold" textAnchor="middle">-</text>
        
        {/* Metallic top cap vent details */}
        <ellipse cx="50" cy="11" rx="19" ry="2" fill="#aaa" stroke="#333" strokeWidth="0.3" />
        <line x1="44" y1="11" x2="56" y2="11" stroke="#333" strokeWidth="0.5" />
        <line x1="50" y1="9" x2="50" y2="13" stroke="#333" strokeWidth="0.5" />

        {/* Value markings text */}
        <text x="56" y="36" fill="#fff" fontSize="6.5" fontFamily="sans-serif" fontWeight="600" opacity="0.8">10 µF</text>
        <text x="56" y="48" fill="#ffd700" fontSize="5" fontFamily="sans-serif" opacity="0.6">25 V</text>
    </svg>
);

// Diode Icon (Cathode silver band)
export const DiodeIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <line x1="5" y1="50" x2="95" y2="50" stroke="#c5c5c8" strokeWidth="3" strokeLinecap="round" />
        
        {/* Diode body */}
        <rect x="26" y="34" width="48" height="32" rx="3" fill="#18181a" stroke="#000" strokeWidth="1" />
        
        {/* Cathode indicator stripe (Silver band on right end) */}
        <rect x="60" y="34.4" width="8" height="31.2" fill="#c0c0c0" />
        
        {/* Silkscreen text */}
        <text x="44" y="53" fill="#999" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">1N4007</text>
    </svg>
);

// TO-92 Transistor Icon (NPN/PNP flat-backed package)
export const TransistorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        {/* Three metallic leads */}
        <path d="M 36 50 L 36 96 M 50 50 L 50 96 M 64 50 L 64 96" stroke="#dcdcdc" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* Curved TO-92 body representing flat back */}
        <path d="M 24 45 C 24 16, 76 16, 76 45 Z" fill="#252528" stroke="#111" strokeWidth="1" />
        {/* Flat face cover */}
        <path d="M 24 44 H 76 V 50 H 24 Z" fill="#18181b" />
        <rect x="24" y="44" width="52" height="2" fill="#444" />
        
        {/* Silkscreen code */}
        <text x="50" y="36" fill="#aaa" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">2N2222</text>
    </svg>
);

// Integrated Circuit DIP-16 Chip Icon (General Logic/Shift Register representation)
export const ICChipIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="chipBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c2c2f" />
                <stop offset="100%" stopColor="#121214" />
            </linearGradient>
        </defs>
        {/* 16 Pins extending outwards (8 on left, 8 on right) */}
        {[...Array(8)].map((_, i) => {
            const y = 14 + i * 10.5;
            return (
                <g key={i}>
                    {/* Left side pins */}
                    <path d={`M 8 ${y + 2.5} H 20`} stroke="#cccccc" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Right side pins */}
                    <path d={`M 80 ${y + 2.5} H 92`} stroke="#cccccc" strokeWidth="2.5" strokeLinecap="round" />
                </g>
            );
        })}

        {/* DIP-16 Black Casing */}
        <rect x="20" y="6" width="60" height="88" rx="4" fill="url(#chipBody)" stroke="#050505" strokeWidth="1.2" />
        
        {/* Notched marker (Top) */}
        <path d="M 44 6 C 44 11, 56 11, 56 6 Z" fill="#121214" stroke="#050505" strokeWidth="1" />
        <circle cx="28" cy="14" r="2.5" fill="#333" /> {/* Pin 1 dot indicator */}

        {/* Laser Etched Chip Label */}
        <g transform="rotate(-90, 50, 50)">
            <text x="50" y="47" fill="#e5e5e5" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">74HC595</text>
            <text x="50" y="57" fill="#88888b" fontSize="5.5" fontFamily="monospace" textAnchor="middle">SN74HC595N</text>
        </g>
    </svg>
);

// 9V Battery Icon (Power source)
export const Battery9VIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="batteryGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff9900" />
                <stop offset="40%" stopColor="#d47c11" />
                <stop offset="100%" stopColor="#1e222b" />
            </linearGradient>
            <linearGradient id="goldGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe494" />
                <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
        </defs>
        {/* Main Body */}
        <rect x="22" y="18" width="56" height="74" rx="5" fill="url(#batteryGrad)" stroke="#111" strokeWidth="1.2" />
        
        {/* Top Snap Terminals */}
        {/* Male snap (hexagonal crown) */}
        <circle cx="38" cy="10" r="6" fill="#a5a5a9" stroke="#666" strokeWidth="0.8" />
        <circle cx="38" cy="10" r="3.5" fill="#f0f0f2" />
        {/* Female snap (round crown) */}
        <circle cx="62" cy="10" r="7" fill="#a5a5a9" stroke="#666" strokeWidth="0.8" />
        <circle cx="62" cy="10" r="4.5" fill="#303033" />

        {/* Battery markings */}
        <text x="50" y="44" fill="#ffffff" fontSize="12" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.05em">9V</text>
        <text x="50" y="56" fill="url(#goldGrad2)" fontSize="6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">POWER SOURCE</text>
        <rect x="32" y="66" width="36" height="2" fill="#ffd700" opacity="0.6" />
        
        {/* Polarities */}
        <text x="38" y="28" fill="#ff3333" fontSize="10" fontWeight="bold" textAnchor="middle">-</text>
        <text x="62" y="28" fill="#00e5ff" fontSize="9" fontWeight="bold" textAnchor="middle">+</text>
    </svg>
);

// AA Dual Battery Holder Icon
export const BatteryAAIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="aaGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#fff" />
                <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
        </defs>
        {/* Black plastic holder box */}
        <rect x="15" y="10" width="70" height="80" rx="4" fill="#18181c" stroke="#333" strokeWidth="1" />
        <rect x="49" y="10" width="2" height="80" fill="#0d0d0f" /> {/* Divider */}

        {/* Left AA Battery */}
        <rect x="18" y="16" width="28" height="68" rx="2" fill="#0d5cb5" />
        <rect x="18" y="16" width="28" height="15" fill="url(#aaGold)" />
        <circle cx="32" cy="13" r="3.5" fill="url(#aaGold)" />
        
        {/* Right AA Battery */}
        <rect x="54" y="16" width="28" height="68" rx="2" fill="#0d5cb5" />
        <rect x="54" y="16" width="28" height="15" fill="url(#aaGold)" />
        <circle cx="68" cy="13" r="3.5" fill="url(#aaGold)" />

        {/* Polarities & labels */}
        <text x="32" y="52" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">AA 1.5V</text>
        <text x="68" y="52" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">AA 1.5V</text>

        {/* Wire leads extending bottom */}
        <path d="M 32 90 L 32 98 L 22 98" fill="none" stroke="#ff3333" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 68 90 L 68 98 L 78 98" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
);

// Piezo Buzzer Icon
export const BuzzerIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="buzzerBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#303035" />
                <stop offset="60%" stopColor="#1c1c1f" />
                <stop offset="100%" stopColor="#0d0d0f" />
            </linearGradient>
        </defs>
        {/* Solder pins */}
        <line x1="40" y1="65" x2="40" y2="95" stroke="#dcdcdc" strokeWidth="3" />
        <line x1="60" y1="65" x2="60" y2="92" stroke="#dcdcdc" strokeWidth="3" />

        {/* Cylindrical cap body */}
        <circle cx="50" cy="45" r="32" fill="url(#buzzerBody)" stroke="#111" strokeWidth="1.2" />
        
        {/* Top Soundhole */}
        <circle cx="50" cy="45" r="8" fill="#000" />
        
        {/* Positive polarity marker */}
        <text x="50" y="24" fill="#3fb950" fontSize="10" fontWeight="bold" textAnchor="middle">+</text>
        
        {/* Outer grip ridges */}
        <circle cx="50" cy="45" r="28" fill="none" stroke="#2c2c2f" strokeWidth="1" />
    </svg>
);

// 5V Relay Module Icon
export const RelayIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="relayBlue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00aced" />
                <stop offset="100%" stopColor="#0077a5" />
            </linearGradient>
        </defs>
        {/* PCB Backing */}
        <rect x="10" y="15" width="80" height="70" rx="4" fill="#0b241b" stroke="#123d2e" strokeWidth="1.5" />
        
        {/* Terminal block connector (Green block at left) */}
        <rect x="6" y="32" width="16" height="36" rx="2" fill="#2d6e3c" stroke="#1f4c29" strokeWidth="1" />
        <circle cx="14" cy="41" r="3" fill="#ffe494" />
        <circle cx="14" cy="50" r="3" fill="#ffe494" />
        <circle cx="14" cy="59" r="3" fill="#ffe494" />

        {/* Main Relay Box (Blue Sugar Cube) */}
        <rect x="28" y="20" width="56" height="60" rx="3" fill="url(#relayBlue)" stroke="#005a7d" strokeWidth="1" />
        
        {/* Terminal text markings */}
        <text x="56" y="38" fill="#fff" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">SRD-05VDC</text>
        <text x="56" y="47" fill="#ffe494" fontSize="5.5" fontFamily="sans-serif" textAnchor="middle">10A 250VAC</text>
        <rect x="36" y="55" width="40" height="15" rx="1" fill="#005a7d" opacity="0.3" />
        <text x="56" y="65" fill="#e5e5e5" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">RELAY</text>
    </svg>
);

// Toy DC Motor Icon
export const DCMotorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="metalCylinder" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eeeeee" />
                <stop offset="35%" stopColor="#cccccc" />
                <stop offset="70%" stopColor="#999999" />
                <stop offset="100%" stopColor="#bbbbbb" />
            </linearGradient>
        </defs>
        {/* Shaft */}
        <rect x="47" y="2" width="6" height="24" fill="#a0a0a5" stroke="#777" strokeWidth="0.5" />
        {/* Brass Cog/Gear */}
        <rect x="43" y="10" width="14" height="10" rx="1" fill="#d4af37" stroke="#b48c1f" strokeWidth="0.5" />

        {/* Main Cylindrical Can */}
        <rect x="22" y="26" width="56" height="52" rx="10" fill="url(#metalCylinder)" stroke="#888" strokeWidth="1" />
        <path d="M 22 36 H 78 M 22 68 H 78" stroke="#aaa" strokeWidth="0.5" />

        {/* Plastic Back Cap (typically red or grey) */}
        <path d="M 24 78 C 24 90, 76 90, 76 78 Z" fill="#8e24aa" stroke="#5c007a" strokeWidth="1" />

        {/* Two Connection Terminals */}
        <circle cx="34" cy="85" r="2.5" fill="#ffe494" stroke="#bbb" strokeWidth="0.5" />
        <circle cx="66" cy="85" r="2.5" fill="#ffe494" stroke="#bbb" strokeWidth="0.5" />
    </svg>
);

// Stepper Motor Icon
export const StepperMotorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="stepperBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#444851" />
                <stop offset="100%" stopColor="#202228" />
            </linearGradient>
        </defs>
        {/* Square main face */}
        <rect x="18" y="18" width="64" height="64" rx="6" fill="url(#stepperBody)" stroke="#18191d" strokeWidth="1.5" />
        
        {/* Aluminum corner flanges */}
        <rect x="14" y="14" width="8" height="8" rx="1" fill="#bbb" />
        <rect x="78" y="14" width="8" height="8" rx="1" fill="#bbb" />
        <rect x="14" y="78" width="8" height="8" rx="1" fill="#bbb" />
        <rect x="78" y="78" width="8" height="8" rx="1" fill="#bbb" />

        {/* Front round hub section */}
        <circle cx="50" cy="50" r="22" fill="#c2c2c5" stroke="#909095" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="14" fill="#a0a0a5" />

        {/* Center D-shaft */}
        <circle cx="50" cy="50" r="5" fill="#e0e0e0" />
        <path d="M 48 45 H 52 M 52 45 L 50 50 Z" fill="#b0b0b5" stroke="#888" strokeWidth="0.5" />

        {/* Ribbon cable outlet connector */}
        <rect x="36" y="80" width="28" height="6" fill="#111" rx="0.5" />
        <path d="M 40 86 L 40 98 M 46 86 L 46 98 M 52 86 L 52 98 M 58 86 L 58 98" stroke="#0077a5" strokeWidth="1.5" />
    </svg>
);

// LDR Light Dependent Resistor Icon
export const LDRIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        {/* Wire Leads */}
        <line x1="40" y1="55" x2="40" y2="98" stroke="#dcdcdc" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="60" y1="55" x2="60" y2="98" stroke="#dcdcdc" strokeWidth="2.2" strokeLinecap="round" />

        {/* Ceramic Disc Body */}
        <rect x="28" y="24" width="44" height="28" rx="8" fill="#e8cca0" stroke="#cd8e3b" strokeWidth="1" />
        {/* Red track background */}
        <rect x="32" y="28" width="36" height="20" rx="6" fill="#ff4d4d" />

        {/* Cadmium Sulfide Wavy Track (Golden zig-zag line) */}
        <path d="M 36 34 Q 40 30, 44 34 T 52 34 T 60 34 T 64 34" fill="none" stroke="#ffeb3b" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 36 42 Q 40 38, 44 42 T 52 42 T 60 42 T 64 42" fill="none" stroke="#ffeb3b" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* Transparent glass coating gloss */}
        <ellipse cx="50" cy="38" rx="14" ry="7" fill="#fff" opacity="0.15" />
    </svg>
);

// PIR Motion Sensor Icon
export const PIRIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        {/* PCB Board backing (curved green module) */}
        <rect x="14" y="24" width="72" height="60" rx="3" fill="#0f3c2b" stroke="#004d40" strokeWidth="1" />
        
        {/* Header pins at bottom */}
        <line x1="42" y1="84" x2="42" y2="95" stroke="#ffe494" strokeWidth="2" />
        <line x1="50" y1="84" x2="50" y2="95" stroke="#ffe494" strokeWidth="2" />
        <line x1="58" y1="84" x2="58" y2="95" stroke="#ffe494" strokeWidth="2" />

        {/* White Segmented Fresnel Lens Dome */}
        <circle cx="50" cy="46" r="24" fill="#eeeeee" stroke="#cccccc" strokeWidth="0.8" />
        {/* Facet lines */}
        <circle cx="50" cy="46" r="16" fill="none" stroke="#dcdcdc" strokeWidth="0.5" />
        <circle cx="50" cy="46" r="8" fill="none" stroke="#dcdcdc" strokeWidth="0.5" />
        <line x1="26" y1="46" x2="74" y2="46" stroke="#dcdcdc" strokeWidth="0.5" />
        <line x1="50" y1="22" x2="50" y2="70" stroke="#dcdcdc" strokeWidth="0.5" />
        <line x1="33" y1="29" x2="67" y2="63" stroke="#dcdcdc" strokeWidth="0.5" />
        <line x1="33" y1="63" x2="67" y2="29" stroke="#dcdcdc" strokeWidth="0.5" />
    </svg>
);

// Soil Moisture Sensor Icon
export const SoilSensorIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="probeGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ffe494" />
                <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
        </defs>
        {/* Custom fork probe board (Matte black PCB) */}
        <path d="M 28 5 L 72 5 V 28 L 66 32 L 66 90 Q 66 98, 58 98 H 56 L 56 36 H 44 L 44 98 H 42 Q 34 98, 34 90 L 34 32 L 28 28 Z" fill="#1b1b22" stroke="#2c2c35" strokeWidth="1" />
        
        {/* Golden conductor prongs */}
        <path d="M 37 40 L 37 92" stroke="url(#probeGold)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 63 40 L 63 92" stroke="url(#probeGold)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 37 40 H 63" stroke="url(#probeGold)" strokeWidth="2" />

        {/* 4 Pin Header connector block (Top) */}
        <rect x="40" y="2" width="20" height="4" fill="#222" />
        <line x1="44" y1="0" x2="44" y2="4" stroke="#ffe494" strokeWidth="1.5" />
        <line x1="50" y1="0" x2="50" y2="4" stroke="#ffe494" strokeWidth="1.5" />
        <line x1="56" y1="0" x2="56" y2="4" stroke="#ffe494" strokeWidth="1.5" />
    </svg>
);

// MPU6050 Gyroscope Board Icon
export const GyroscopeIcon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="pcbBlueGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0288d1" />
                <stop offset="100%" stopColor="#01579b" />
            </linearGradient>
        </defs>
        {/* PCB Board (Blue square) */}
        <rect x="12" y="12" width="76" height="76" rx="4" fill="url(#pcbBlueGrad2)" stroke="#0277bd" strokeWidth="1.2" />
        
        {/* 8-Pin golden headers along the top */}
        {[...Array(8)].map((_, i) => {
            const x = 18 + i * 9.1;
            return <circle key={i} cx={x} cy={18} r="2.2" fill="#ffd700" stroke="#b8860b" strokeWidth="0.5" />;
        })}

        {/* Gyro/Accel main QFN chip (black block with gold solder pads) */}
        <rect x="36" y="38" width="28" height="28" rx="1" fill="#1c1c1f" stroke="#000" strokeWidth="1.2" />
        <circle cx="50" cy="52" r="2.5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
        
        {/* Surrounding SMD resistors/caps */}
        <rect x="22" y="44" width="6" height="4" fill="#a0a0a5" />
        <rect x="22" y="56" width="6" height="4" fill="#a0522d" />
        <rect x="72" y="44" width="4" height="6" fill="#a0a0a5" />
        <rect x="72" y="56" width="4" height="6" fill="#a0522d" />

        {/* Axes markings */}
        <path d="M 50 52 L 50 30 M 50 52 L 68 52" stroke="#3fb950" strokeWidth="1.2" strokeLinecap="round" />
        <text x="52" y="34" fill="#3fb950" fontSize="5" fontFamily="monospace">Y</text>
        <text x="66" y="49" fill="#3fb950" fontSize="5" fontFamily="monospace">X</text>
    </svg>
);

// 1602 LCD Character Screen Icon
export const LCD1602Icon = () => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
        <defs>
            <linearGradient id="pcbGreenGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0b5220" />
                <stop offset="100%" stopColor="#042a10" />
            </linearGradient>
            <linearGradient id="lcdBezel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#444" />
                <stop offset="100%" stopColor="#111" />
            </linearGradient>
        </defs>
        {/* PCB Board */}
        <rect x="5" y="16" width="90" height="68" rx="4" fill="url(#pcbGreenGrad2)" stroke="#0e5a26" strokeWidth="1.5" />
        
        {/* 16 Pins along the top */}
        {[...Array(16)].map((_, i) => {
            const x = 9 + i * 5.4;
            return <circle key={i} cx={x} cy={21} r="1.5" fill="#ffd700" stroke="#b8860b" strokeWidth="0.3" />;
        })}

        {/* Metal Screen Bezel */}
        <rect x="10" y="27" width="80" height="50" rx="3" fill="url(#lcdBezel)" stroke="#000" strokeWidth="1" />
        
        {/* Backlit Display Area (Glowing Cyan-Green) */}
        <rect x="16" y="33" width="68" height="38" rx="1.5" fill="#3fb950" stroke="#1c5625" strokeWidth="1" />
        
        {/* Two rows of character blocks representation */}
        {[...Array(16)].map((_, i) => {
            const x = 18 + i * 4.0;
            return (
                <g key={i}>
                    <rect x={x} y="37" width="3" height="12" fill="#1c5625" opacity="0.85" />
                    <rect x={x} y="53" width="3" height="12" fill="#1c5625" opacity="0.85" />
                </g>
            );
        })}
    </svg>
);

// High-Fidelity Programmatic SVG Component Icon Generator
export const DynamicComponentIcon = ({ type, label = '', ohm }) => {
    // 1. Color band helper for Resistors
    const getResistorColors = (ohms) => {
        const colorMap = [
            '#1a1a1a', // 0: Black
            '#8b5a2b', // 1: Brown
            '#ff3333', // 2: Red
            '#ff9900', // 3: Orange
            '#ffff00', // 4: Yellow
            '#3fb950', // 5: Green
            '#0066cc', // 6: Blue
            '#8a2be2', // 7: Violet
            '#808080', // 8: Grey
            '#ffffff', // 9: White
        ];

        if (!ohms || ohms <= 0) return [colorMap[0], colorMap[0], colorMap[0], '#d4af37'];

        const str = ohms.toString();
        const digit1 = parseInt(str[0]) || 0;
        const digit2 = parseInt(str[1]) || 0;
        const multiplierVal = str.length - 2;

        let multiplierColor = colorMap[0];
        if (multiplierVal >= 0 && multiplierVal < 10) {
            multiplierColor = colorMap[multiplierVal];
        } else if (multiplierVal === -1) {
            multiplierColor = '#d4af37'; // Gold
        } else if (multiplierVal === -2) {
            multiplierColor = '#c0c0c0'; // Silver
        }

        return [
            colorMap[digit1],
            colorMap[digit2],
            multiplierColor,
            '#d4af37' // Gold tolerance band (5%)
        ];
    };

    // Resistor Renderer
    if (type === 'resistor') {
        const value = ohm || 220;
        const bands = getResistorColors(value);
        return (
            <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
                <defs>
                    <linearGradient id="leadMetal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#cccccc" />
                        <stop offset="50%" stopColor="#f5f5f5" />
                        <stop offset="100%" stopColor="#999999" />
                    </linearGradient>
                    <linearGradient id="resistorTan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fad7a0" />
                        <stop offset="40%" stopColor="#f5c07a" />
                        <stop offset="100%" stopColor="#cca162" />
                    </linearGradient>
                </defs>
                <rect x="5" y="48" width="90" height="4" fill="url(#leadMetal)" rx="1.5" />
                <rect x="25" y="32" width="50" height="36" rx="10" fill="url(#resistorTan)" stroke="#cd8e3b" strokeWidth="0.8" />
                <rect x="30" y="35" width="40" height="30" fill="url(#resistorTan)" />
                <rect x="34" y="33" width="4" height="34" fill={bands[0]} />
                <rect x="42" y="35" width="4" height="30" fill={bands[1]} />
                <rect x="50" y="35" width="4" height="30" fill={bands[2]} />
                <rect x="62" y="33" width="4" height="34" fill={bands[3]} />
                <rect x="25" y="32" width="50" height="4" fill="#ffffff" opacity="0.35" />
                <rect x="25" y="64" width="50" height="4" fill="#000000" opacity="0.2" />
            </svg>
        );
    }

    // DIP Integrated Circuits Renderer (e.g. logic gates, 555 timers, op-amps)
    const isDip = ['ne555', '74hc595', 'gate_and', 'l293d', 'attiny85'].includes(type) || 
                  (label && (label.startsWith('74') || label.startsWith('CD') || label.startsWith('LM') || label.startsWith('TL') || label.startsWith('NE') || label.includes('Gate') || label.includes('Timer') || label.includes('Amplifier')));
    
    if (isDip) {
        let pinCount = 8;
        if (label.startsWith('74HC154') || label.includes('24-Pin') || label.includes('Driver')) pinCount = 16;
        else if (label.startsWith('74') || label.startsWith('CD') || label.startsWith('LM324')) pinCount = 14;
        
        const half = pinCount / 2;
        const shortName = label.split(' ')[0] || 'IC';

        return (
            <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
                <defs>
                    <linearGradient id="chipBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2c2c2f" />
                        <stop offset="100%" stopColor="#121214" />
                    </linearGradient>
                </defs>
                {/* Leg Pins */}
                {Array.from({ length: half }).map((_, i) => {
                    const y = 14 + i * (66 / (half - 1 || 1));
                    return (
                        <g key={i}>
                            <path d={`M 8 ${y + 2.5} H 20`} stroke="#cccccc" strokeWidth="2.5" strokeLinecap="round" />
                            <path d={`M 80 ${y + 2.5} H 92`} stroke="#cccccc" strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                    );
                })}
                {/* Chip body */}
                <rect x="20" y="6" width="60" height="88" rx="4" fill="url(#chipBody)" stroke="#050505" strokeWidth="1.2" />
                {/* Notch */}
                <path d="M 44 6 C 44 11, 56 11, 56 6 Z" fill="#121214" stroke="#050505" strokeWidth="1" />
                <circle cx="28" cy="14" r="2.5" fill="#333" />
                
                {/* Laser printed label */}
                <g transform="rotate(-90, 50, 50)">
                    <text x="50" y="47" fill="#e5e5e5" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">{shortName}</text>
                    <text x="50" y="56" fill="#88888b" fontSize="5" fontFamily="monospace" textAnchor="middle">KONE SEMI</text>
                </g>
            </svg>
        );
    }

    // Generic Sensor Breakout / Developer Module
    const isModule = ['pir', 'soil', 'gyro', 'dht11', 'relay'].includes(type) ||
                     (label && (label.includes('Sensor') || label.includes('Breakout') || label.includes('Module') || label.includes('ESP32') || label.includes('Arduino') || label.includes('Pico') || label.includes('Shield') || label.includes('Receiver') || label.includes('Transmitter') || label.includes('Adapter') || label.includes('Board') || label.includes('RTC') || label.includes('ADC')));

    if (isModule) {
        // Choose board color based on label hash to create visual variety!
        const colors = ['#0c562e', '#01579b', '#6f42c1', '#b83b1d', '#333333'];
        const charSum = label.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const boardColor = colors[charSum % colors.length];

        return (
            <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
                <rect x="10" y="10" width="80" height="80" rx="5" fill={boardColor} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                
                {/* Gold header pins along the bottom */}
                {[...Array(6)].map((_, i) => {
                    const x = 20 + i * 12;
                    return (
                        <g key={i}>
                            <rect x={x} y="82" width="6" height="12" fill="#d4af37" rx="0.5" />
                            <circle cx={x + 3} cy={76} r="2.2" fill="#ffd700" stroke="#b8860b" strokeWidth="0.5" />
                        </g>
                    );
                })}

                {/* Central microchip or component visual */}
                <rect x="35" y="30" width="30" height="30" rx="2" fill="#1f2328" stroke="#000" strokeWidth="1" />
                <circle cx="50" cy="45" r="4" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.3" />

                {/* Solder blobs */}
                <circle cx="20" cy="20" r="3.5" fill="#f0f0f2" stroke="#444" strokeWidth="0.5" />
                <circle cx="80" cy="20" r="3.5" fill="#f0f0f2" stroke="#444" strokeWidth="0.5" />

                {/* Module title text */}
                <text x="50" y="68" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" opacity="0.75">
                    {label.split(' ')[0] || 'MODULE'}
                </text>
            </svg>
        );
    }

    // Default Fallback Icon
    return (
        <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}>
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#1f2328" stroke="#30363d" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="#58a6ff" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="50" y="53" fill="#8b949e" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">{label.substring(0, 4) || 'DEV'}</text>
        </svg>
    );
};
