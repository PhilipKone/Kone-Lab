import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, Html, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

// Normalized hardware components helper for 1000+ database variants
export const getNormalizedComponentInfo = (component) => {
    const type = component.type || '';
    const name = component.name || '';
    const lowerName = name.toLowerCase();
    
    let baseType = type;
    let label = name || type;
    
    if (type === 'resistor' || type.startsWith('resistor_var_') || type.startsWith('resistor_auto_')) {
        return { baseType: 'resistor', label, pinCount: 2 };
    }
    
    if (type === 'cap_ceramic' || type.startsWith('cap_ceramic') || (type.startsWith('cap_var_') && !lowerName.includes('electrolytic'))) {
        return { baseType: 'capacitor_ceramic', label, pinCount: 2 };
    }
    
    if (type === 'cap_electrolytic' || type.startsWith('cap_electrolytic') || (type.startsWith('cap_var_') && lowerName.includes('electrolytic'))) {
        return { baseType: 'capacitor_electrolytic', label, pinCount: 2 };
    }
    
    if (type === 'diode' || (type.startsWith('semi_var_') && lowerName.includes('diode'))) {
        return { baseType: 'diode', label, pinCount: 2 };
    }
    
    if (type === 'transistor' || (type.startsWith('semi_var_') && lowerName.includes('transistor'))) {
        return { baseType: 'transistor', label, pinCount: 3 };
    }
    
    if (type === 'led' || (type.startsWith('opto_var_') && lowerName.includes('led') && !lowerName.includes('ring') && !lowerName.includes('matrix'))) {
        let parsedColor = 'red';
        if (lowerName.includes('green')) parsedColor = 'green';
        else if (lowerName.includes('blue')) parsedColor = 'blue';
        else if (lowerName.includes('yellow')) parsedColor = 'yellow';
        return { baseType: 'led', color: component.color || parsedColor, label, pinCount: 2 };
    }
    
    // Check if it's a DIP IC
    const isDipIC = ['attiny85', 'ne555', '74hc595', 'gate_and', 'l293d'].includes(type) ||
                    type.startsWith('gate_var_') ||
                    type.startsWith('analog_var_');
                    
    if (isDipIC) {
        let pins = 8;
        if (lowerName.includes('74hc154')) {
            pins = 24;
        } else if (lowerName.includes('74hc4066') || lowerName.includes('74hc4017') || lowerName.includes('74hc595') || lowerName.includes('l293d') || lowerName.includes('lm324') || lowerName.includes('tl084') || lowerName.includes('lm339') || lowerName.includes('74hc74') || lowerName.includes('74hc175') || lowerName.includes('74hc283')) {
            pins = 16;
            if (lowerName.includes('lm324') || lowerName.includes('tl084') || lowerName.includes('lm339')) {
                pins = 14;
            }
        } else if (lowerName.includes('74hc00') || lowerName.includes('74hc02') || lowerName.includes('74hc04') || lowerName.includes('74hc08') || lowerName.includes('74hc10') || lowerName.includes('74hc14') || lowerName.includes('74hc32') || lowerName.includes('74hc86') || lowerName.includes('74hc125') || lowerName.includes('74hc138') || lowerName.includes('74hc164') || lowerName.includes('74hc165')) {
            pins = 14;
        } else if (lowerName.includes('attiny85') || lowerName.includes('ne555') || lowerName.includes('lm358') || lowerName.includes('tl072') || lowerName.includes('lm386') || lowerName.includes('lm393') || lowerName.includes('ne5532')) {
            pins = 8;
        }
        
        // Dynamic pin override from name (e.g. LM324 ... 14-Pin DIP)
        const pinMatch = lowerName.match(/(\d+)-pin/);
        if (pinMatch) {
            pins = parseInt(pinMatch[1]);
        } else {
            if (type === 'gate_and') pins = 14;
            else if (['74hc595', 'l293d'].includes(type)) pins = 16;
        }
        
        // Clean label
        const codeMatch = name.match(/^(74HC\d+|LM\d+|TL\d+|NE\d+|ATtiny\d+)/i);
        const cleanLabel = codeMatch ? codeMatch[1] : (name.split(' ')[0] || type);
        
        return { baseType: 'dip_ic', pinCount: pins, label: cleanLabel };
    }
    
    // Actuators & Motors
    if (type === 'motor' || lowerName.includes('servo')) {
        return { baseType: 'motor', label, pinCount: 3 };
    }
    if (type === 'dc_motor' || lowerName.includes('dc motor') || lowerName.includes('fan')) {
        return { baseType: 'dc_motor', label, pinCount: 2 };
    }
    if (type === 'stepper' || lowerName.includes('stepper')) {
        return { baseType: 'stepper', label, pinCount: 3 };
    }
    if (type === 'buzzer' || lowerName.includes('buzzer')) {
        return { baseType: 'buzzer', label, pinCount: 2 };
    }
    if (type === 'relay' || lowerName.includes('relay')) {
        return { baseType: 'relay', label, pinCount: 3 };
    }
    
    // Displays
    if (type === 'oled' || lowerName.includes('oled')) {
        return { baseType: 'oled', label, pinCount: 4 };
    }
    if (type === 'lcd1602' || lowerName.includes('lcd')) {
        return { baseType: 'lcd1602', label, pinCount: 4 };
    }
    
    // Environmental / Motion Sensors
    if (type === 'dht11' || type.startsWith('env_var_')) {
        return { baseType: 'dht11', label, pinCount: 3 };
    }
    if (type === 'soil') {
        return { baseType: 'soil', label, pinCount: 3 };
    }
    if (type === 'sensor') {
        return { baseType: 'sensor', label, pinCount: 4 };
    }
    if (type === 'pir') {
        return { baseType: 'pir', label, pinCount: 3 };
    }
    if (type === 'gyro' || type.startsWith('motion_var_') || type.startsWith('comm_var_')) {
        let pins = 5;
        if (lowerName.includes('rfid')) pins = 8;
        return { baseType: 'gyro', label, pinCount: pins };
    }
    
    // Power
    if (type === 'battery_9v' || type.startsWith('pwr_var_') || lowerName.includes('9v')) {
        return { baseType: 'battery_9v', label, pinCount: 2 };
    }
    if (type === 'battery_aa' || lowerName.includes('aa')) {
        return { baseType: 'battery_aa', label, pinCount: 2 };
    }
    
    return { baseType, label, pinCount: 8 };
};

// Coordinate lookup for pin offsets relative to component centers
export const getPinWorldPosition = (component, pinName) => {
    const { position, scale = 1, rotation = [0, 0, 0] } = component;
    let offset = [0, 0, 0];
    
    const info = getNormalizedComponentInfo(component);
    const { baseType, pinCount = 8 } = info;
    
    if (baseType === 'control') {
        switch (pinName) {
            case '5V': offset = [-0.4, 0.15, -0.5]; break;
            case 'GND': offset = [-0.1, 0.15, -0.5]; break;
            case 'A0': offset = [0.2, 0.15, -0.5]; break;
            case 'D9': offset = [0.0, 0.15, 0.5]; break;
            case 'D10': offset = [0.3, 0.15, 0.5]; break;
        }
    } else if (baseType === 'motor') {
        switch (pinName) {
            case 'VCC': offset = [-0.1, -0.35, 0]; break;
            case 'GND': offset = [0.0, -0.35, 0]; break;
            case 'PWM': offset = [0.1, -0.35, 0]; break;
        }
    } else if (baseType === 'sensor') {
        switch (pinName) {
            case 'VCC': offset = [-0.12, -0.22, -0.05]; break;
            case 'GND': offset = [-0.04, -0.22, -0.05]; break;
            case 'TRIG': offset = [0.04, -0.22, -0.05]; break;
            case 'ECHO': offset = [0.12, -0.22, -0.05]; break;
        }
    } else if (baseType === 'esp32') {
        switch (pinName) {
            case '3V3': offset = [-0.5, 0.1, -0.3]; break;
            case 'GND': offset = [-0.2, 0.1, -0.3]; break;
            case 'GPIO2': offset = [0.1, 0.1, 0.3]; break;
            case 'GPIO4': offset = [0.4, 0.1, 0.3]; break;
            case 'EN': offset = [-0.5, 0.1, 0.3]; break;
        }
    } else if (baseType === 'pico') {
        switch (pinName) {
            case '3V3': offset = [-0.5, 0.1, -0.25]; break;
            case 'GND': offset = [-0.2, 0.1, -0.25]; break;
            case 'GP2': offset = [0.1, 0.1, 0.25]; break;
            case 'GP3': offset = [0.3, 0.1, 0.25]; break;
            case 'VSYS': offset = [-0.5, 0.1, 0.25]; break;
        }
    } else if (baseType === 'oled') {
        switch (pinName) {
            case 'VCC': offset = [-0.15, 0.35, 0.05]; break;
            case 'GND': offset = [-0.05, 0.35, 0.05]; break;
            case 'SCL': offset = [0.05, 0.35, 0.05]; break;
            case 'SDA': offset = [0.15, 0.35, 0.05]; break;
        }
    } else if (baseType === 'dht11') {
        switch (pinName) {
            case 'VCC': offset = [-0.08, -0.32, 0]; break;
            case 'GND': offset = [0.0, -0.32, 0]; break;
            case 'DATA': offset = [0.08, -0.32, 0]; break;
        }
    } else if (baseType === 'led') {
        switch (pinName) {
            case 'Cathode': offset = [-0.08, -0.3, 0]; break;
            case 'Anode': offset = [0.08, -0.3, 0]; break;
        }
    } else if (baseType === 'resistor') {
        switch (pinName) {
            case 'Pin A': offset = [-0.6, 0, 0]; break;
            case 'Pin B': offset = [0.6, 0, 0]; break;
        }
    } else if (baseType === 'breadboard') {
        switch (pinName) {
            case '+ Rail (L)': offset = [-1.5, 0.07, -0.7]; break;
            case '- Rail (L)': offset = [-1.5, 0.07, -0.5]; break;
            case '+ Rail (R)': offset = [1.5, 0.07, 0.5]; break;
            case '- Rail (R)': offset = [1.5, 0.07, 0.7]; break;
            case 'Row 1 (A)': offset = [-1.5, 0.07, -0.2]; break;
            case 'Row 1 (B)': offset = [-1.5, 0.07, 0.2]; break;
            case 'Row 5 (A)': offset = [-1.0, 0.07, -0.2]; break;
            case 'Row 5 (B)': offset = [-1.0, 0.07, 0.2]; break;
            case 'Row 10 (A)': offset = [-0.5, 0.07, -0.2]; break;
            case 'Row 10 (B)': offset = [-0.5, 0.07, 0.2]; break;
            case 'Row 15 (A)': offset = [0.0, 0.07, -0.2]; break;
            case 'Row 15 (B)': offset = [0.0, 0.07, 0.2]; break;
            case 'Row 20 (A)': offset = [0.5, 0.07, -0.2]; break;
            case 'Row 20 (B)': offset = [0.5, 0.07, 0.2]; break;
            case 'Row 25 (A)': offset = [1.0, 0.07, -0.2]; break;
            case 'Row 25 (B)': offset = [1.0, 0.07, 0.2]; break;
            case 'Row 30 (A)': offset = [1.5, 0.07, -0.2]; break;
            case 'Row 30 (B)': offset = [1.5, 0.07, 0.2]; break;
        }
    } else if (baseType === 'dip_ic') {
        const pinNum = parseInt(pinName.replace('Pin ', '')) || 1;
        
        const spacing = 0.11;
        const half = pinCount / 2;
        if (pinNum <= half) {
            // Left side pins run top-to-bottom
            offset = [
                -((half - 1) * spacing) / 2 + (pinNum - 1) * spacing,
                -0.12,
                -0.22
            ];
        } else {
            // Right side pins run bottom-to-top
            offset = [
                ((half - 1) * spacing) / 2 - (pinNum - half - 1) * spacing,
                -0.12,
                0.22
            ];
        }
    } else if (baseType === 'potentiometer') {
        switch (pinName) {
            case 'Pin 1': offset = [-0.2, -0.2, 0.1]; break;
            case 'Pin 2': offset = [0, -0.2, 0.1]; break;
            case 'Pin 3': offset = [0.2, -0.2, 0.1]; break;
        }
    } else if (baseType === 'transistor') {
        switch (pinName) {
            case 'Emitter': offset = [-0.1, -0.2, 0]; break;
            case 'Base': offset = [0, -0.2, 0]; break;
            case 'Collector': offset = [0.1, -0.2, 0]; break;
        }
    } else if (baseType === 'battery_9v') {
        switch (pinName) {
            case '-': offset = [-0.15, 0.1, -0.3]; break;
            case '+': offset = [0.15, 0.1, -0.3]; break;
        }
    } else if (baseType === 'battery_aa') {
        switch (pinName) {
            case '-': offset = [-0.2, -0.2, 0.2]; break;
            case '+': offset = [0.2, -0.2, 0.2]; break;
        }
    } else if (baseType === 'dc_motor') {
        switch (pinName) {
            case 'Pin A': offset = [-0.15, -0.2, 0]; break;
            case 'Pin B': offset = [0.15, -0.2, 0]; break;
        }
    } else if (['stepper', 'relay', 'pir', 'soil'].includes(baseType)) {
        switch (pinName) {
            case 'VCC': offset = [-0.1, -0.2, 0]; break;
            case 'GND': offset = [0, -0.2, 0]; break;
            case 'SIG': case 'OUT': offset = [0.1, -0.2, 0]; break;
        }
    } else if (baseType === 'buzzer') {
        switch (pinName) {
            case '-': offset = [-0.15, -0.2, 0]; break;
            case '+': offset = [0.15, -0.2, 0]; break;
        }
    } else if (baseType === 'ldr') {
        switch (pinName) {
            case 'Pin A': offset = [-0.15, -0.15, 0]; break;
            case 'Pin B': offset = [0.15, -0.15, 0]; break;
        }
    } else if (baseType === 'gyro') {
        const pinNum = parseInt(pinName.replace('Pin ', '')) || 1;
        switch (pinName) {
            case 'VCC': offset = [-0.2, -0.2, 0]; break;
            case 'GND': offset = [-0.1, -0.2, 0]; break;
            case 'SCL': offset = [0, -0.2, 0]; break;
            case 'SDA': offset = [0.1, -0.2, 0]; break;
            case 'INT': offset = [0.2, -0.2, 0]; break;
            default:
                offset = [-0.2 + ((pinNum - 1) / (pinCount - 1)) * 0.4, -0.2, 0];
        }
    } else if (baseType === 'lcd1602') {
        switch (pinName) {
            case 'VCC': offset = [-0.15, -0.2, 0]; break;
            case 'GND': offset = [-0.05, -0.2, 0]; break;
            case 'SCL': offset = [0.05, -0.2, 0]; break;
            case 'SDA': offset = [0.15, -0.2, 0]; break;
        }
    } else if (baseType === 'capacitor_ceramic') {
        switch (pinName) {
            case 'Pin A': offset = [-0.1, -0.2, 0]; break;
            case 'Pin B': offset = [0.1, -0.2, 0]; break;
        }
    } else if (baseType === 'capacitor_electrolytic') {
        switch (pinName) {
            case '-': offset = [-0.08, -0.2, 0]; break;
            case '+': offset = [0.08, -0.2, 0]; break;
        }
    } else if (baseType === 'diode') {
        switch (pinName) {
            case 'Anode': offset = [-0.3, -0.2, 0]; break;
            case 'Cathode': offset = [0.3, -0.2, 0]; break;
        }
    } else if (baseType === 'breadboard_mini') {
        switch (pinName) {
            case '+ Rail (L)': offset = [-0.8, 0.07, -0.4]; break;
            case '- Rail (L)': offset = [-0.8, 0.07, -0.3]; break;
            case '+ Rail (R)': offset = [0.8, 0.07, 0.3]; break;
            case '- Rail (R)': offset = [0.8, 0.07, 0.4]; break;
            case 'Row 1 (A)': offset = [-0.8, 0.07, -0.1]; break;
            case 'Row 1 (B)': offset = [-0.8, 0.07, 0.1]; break;
            case 'Row 5 (A)': offset = [-0.4, 0.07, -0.1]; break;
            case 'Row 5 (B)': offset = [-0.4, 0.07, 0.1]; break;
            case 'Row 10 (A)': offset = [0.0, 0.07, -0.1]; break;
            case 'Row 10 (B)': offset = [0.0, 0.07, 0.1]; break;
            case 'Row 15 (A)': offset = [0.4, 0.07, -0.1]; break;
            case 'Row 15 (B)': offset = [0.4, 0.07, 0.1]; break;
        }
    }
    
    // Apply Y-axis rotation matching dragging orientation
    const ry = rotation[1] || 0;
    const rx = offset[0] * scale;
    const rz = offset[2] * scale;
    const rotatedX = rx * Math.cos(ry) + rz * Math.sin(ry);
    const rotatedZ = -rx * Math.sin(ry) + rz * Math.cos(ry);
    const rotatedY = offset[1] * scale;
    
    return [
        position[0] + rotatedX,
        position[1] + rotatedY,
        position[2] + rotatedZ
    ];
};

// Premium High-Fidelity Microcontroller (Arduino Uno-like) Model
const ControlUnit = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['5V', 'GND', 'A0', 'D9', 'D10'];
    const pwrLedRef = useRef();

    useFrame((state) => {
        if (pwrLedRef.current) {
            pwrLedRef.current.emissiveIntensity = 2 + Math.sin(state.clock.getElapsedTime() * 4) * 0.3;
        }
    });

    return (
        <group onClick={onClick}>
            {/* PCB Main Board */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.8, 0.08, 1.3]} />
                <meshStandardMaterial color="#0b3022" roughness={0.5} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
                <boxGeometry args={[1.76, 0.01, 1.26]} />
                <meshStandardMaterial color="#0f3c2b" roughness={0.6} metalness={0.1} />
            </mesh>

            {/* Silver USB Port */}
            <mesh position={[-0.7, 0.165, 0.35]} castShadow>
                <boxGeometry args={[0.45, 0.25, 0.4]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[-0.93, 0.165, 0.35]}>
                <boxGeometry args={[0.02, 0.18, 0.3]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Black Power Barrel Jack */}
            <mesh position={[-0.7, 0.14, -0.35]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.45, 16]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
            </mesh>

            {/* Microcontroller ATmega Chip */}
            <mesh position={[0.15, 0.09, 0]} castShadow>
                <boxGeometry args={[0.8, 0.1, 0.25]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
            </mesh>
            {[...Array(14)].map((_, i) => {
                const zOffset = i < 7 ? -0.15 : 0.15;
                const xOffset = -0.33 + (i % 7) * 0.11;
                return (
                    <mesh key={i} position={[0.15 + xOffset, 0.04, zOffset]} castShadow>
                        <boxGeometry args={[0.02, 0.06, 0.04]} />
                        <meshStandardMaterial color="#dcdcdc" metalness={0.9} roughness={0.1} />
                    </mesh>
                );
            })}

            {/* Black Headers */}
            <mesh position={[0.1, 0.09, -0.5]} castShadow>
                <boxGeometry args={[1.0, 0.12, 0.12]} />
                <meshStandardMaterial color="#222" roughness={0.6} />
            </mesh>
            <mesh position={[0.1, 0.09, 0.5]} castShadow>
                <boxGeometry args={[1.0, 0.12, 0.12]} />
                <meshStandardMaterial color="#222" roughness={0.6} />
            </mesh>

            <mesh position={[-0.3, 0.09, -0.35]} ref={pwrLedRef}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2.5} />
            </mesh>

            {selected && (
                <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.1, 1.15, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0] }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'control';
                
                return (
                    <group key={pin} position={localPos}>
                        <mesh 
                            onClick={(e) => {
                                e.stopPropagation();
                                onPinClick('control', pin);
                            }}
                        >
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#58a6ff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.2, 0]} center>
                            <div className="pin-tag-tooltip">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium Photorealistic ESP32 NodeMCU board
const ESP32Board = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['3V3', 'GND', 'GPIO2', 'GPIO4', 'EN'];
    
    return (
        <group onClick={onClick}>
            {/* Matte Black PCB */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.06, 0.8]} />
                <meshStandardMaterial color="#0f0f11" roughness={0.7} metalness={0.1} />
            </mesh>

            {/* Gold PCB Traces */}
            <mesh position={[0, 0.031, 0]}>
                <boxGeometry args={[1.56, 0.005, 0.76]} />
                <meshStandardMaterial color="#0a0a0c" roughness={0.8} />
            </mesh>

            {/* ESP32 WROOM RF Shield */}
            <mesh position={[0.3, 0.08, 0]} castShadow>
                <boxGeometry args={[0.5, 0.08, 0.45]} />
                <meshStandardMaterial color="#c0c0c0" metalness={1.0} roughness={0.15} />
            </mesh>
            <mesh position={[0.3, 0.12, 0]}>
                <boxGeometry args={[0.48, 0.01, 0.43]} />
                <meshStandardMaterial color="#222" roughness={0.8} />
            </mesh>

            {/* Gold Antenna */}
            <mesh position={[0.68, 0.032, 0]}>
                <boxGeometry args={[0.1, 0.002, 0.35]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Headers */}
            <mesh position={[0, 0.06, -0.34]} castShadow>
                <boxGeometry args={[1.4, 0.08, 0.08]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.06, 0.34]} castShadow>
                <boxGeometry args={[1.4, 0.08, 0.08]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
            </mesh>

            {/* Buttons */}
            <mesh position={[-0.65, 0.06, -0.22]} castShadow>
                <boxGeometry args={[0.08, 0.06, 0.08]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.8} />
            </mesh>
            <mesh position={[-0.65, 0.06, 0.22]} castShadow>
                <boxGeometry args={[0.08, 0.06, 0.08]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.8} />
            </mesh>

            {selected && (
                <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.9, 0.95, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0] }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'esp32';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('esp32', pin); }}>
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#bc8cff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.2, 0]} center>
                            <div className="pin-tag-tooltip esp-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity Servo Motor (SG90-like) Model
const ServoMotor = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['VCC', 'GND', 'PWM'];
    const hornRef = useRef();

    useFrame((state) => {
        if (hornRef.current) {
            hornRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.8;
        }
    });

    return (
        <group onClick={onClick}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.55, 0.65, 0.28]} />
                <meshPhysicalMaterial 
                    color="#0066cc" roughness={0.1} metalness={0.1} 
                    transparent opacity={0.85} transmission={0.8} thickness={0.5} 
                />
            </mesh>

            <mesh position={[0.12, 0.325, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
                <meshPhysicalMaterial color="#0066cc" transparent opacity={0.85} transmission={0.8} roughness={0.1} />
            </mesh>
            
            <mesh position={[0.12, 0.38, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>

            <mesh position={[-0.1, 0.31, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
            </mesh>

            <mesh position={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.85, 0.06, 0.28]} />
                <meshPhysicalMaterial color="#0066cc" transparent opacity={0.85} transmission={0.8} roughness={0.1} />
            </mesh>

            <group position={[0.12, 0.42, 0]} ref={hornRef}>
                <mesh castShadow>
                    <boxGeometry args={[0.7, 0.04, 0.1]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.015, 0]}>
                    <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.4} />
                </mesh>
            </group>

            <mesh position={[-0.18, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {selected && (
                <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.55, 0.6, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0] }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'motor';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('motor', pin); }}>
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#3fb950"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, -0.2, 0]} center>
                            <div className="pin-tag-tooltip">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity 0.96" OLED I2C Display Screen with real-time 3D projected HTML canvas texture
const OLEDDisplay = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['VCC', 'GND', 'SCL', 'SDA'];
    const textPulseRef = useRef();

    useFrame((state) => {
        if (textPulseRef.current) {
            textPulseRef.current.style.opacity = 0.7 + Math.sin(state.clock.getElapsedTime() * 3.5) * 0.3;
        }
    });

    return (
        <group onClick={onClick}>
            {/* Deep Blue PCB Backing */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.9, 0.9, 0.05]} />
                <meshStandardMaterial color="#0a2a4a" roughness={0.6} />
            </mesh>

            {/* Golden Header (Top) */}
            <mesh position={[0, 0.38, 0.03]} castShadow>
                <boxGeometry args={[0.45, 0.06, 0.05]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            {/* Glass screen */}
            <mesh position={[0, -0.06, 0.038]} castShadow>
                <boxGeometry args={[0.8, 0.56, 0.025]} />
                <meshPhysicalMaterial 
                    color="#0d1117" roughness={0.05} metalness={0.2}
                    transparent opacity={0.9} transmission={0.1} thickness={0.1}
                />
            </mesh>

            {/* projected 3D screen telemetry */}
            <Html
                transform
                occlude
                distanceFactor={1.4}
                position={[0, -0.06, 0.052]}
                center
                style={{ pointerEvents: 'none' }}
            >
                <div className="oled-3d-screen-container">
                    <div className="oled-header-line">
                        <span>KONE LAB v1.2</span>
                        <span className="oled-blink-dot"></span>
                    </div>
                    <div className="oled-wave-bar"></div>
                    <div className="oled-stats">
                        <div className="stat-line">SYSTEM: OK</div>
                        <div className="stat-line">I2C: 0x3C</div>
                        <div className="stat-line">FPS: 60</div>
                    </div>
                </div>
            </Html>

            {selected && (
                <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.55, 0.6, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0] }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'oled';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('oled', pin); }}>
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#58a6ff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.2, 0]} center>
                            <div className="pin-tag-tooltip oled-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity DHT11 Temperature & Humidity Sensor
const DHT11Sensor = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['VCC', 'GND', 'DATA'];

    return (
        <group onClick={onClick}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.54, 0.22]} />
                <meshStandardMaterial color="#00bcd4" roughness={0.3} metalness={0.1} />
            </mesh>

            {[...Array(3)].map((_, i) => (
                <mesh key={i} position={[0, 0.12 - i * 0.12, 0.112]}>
                    <boxGeometry args={[0.3, 0.03, 0.01]} />
                    <meshStandardMaterial color="#222" roughness={0.9} />
                </mesh>
            ))}

            <mesh position={[0, 0, -0.12]} castShadow>
                <boxGeometry args={[0.46, 0.58, 0.03]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
            </mesh>

            {[...Array(3)].map((_, i) => (
                <mesh key={i} position={[-0.08 + i * 0.08, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
                </mesh>
            ))}

            {selected && (
                <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.35, 0.4, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0] }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'dht11';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('dht11', pin); }}>
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#ffc107"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, -0.2, 0]} center>
                            <div className="pin-tag-tooltip dht-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity Sensor Pack (Ultrasonic HC-SR04-like) Model
const SensorPack = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['VCC', 'GND', 'TRIG', 'ECHO'];

    return (
        <group onClick={onClick}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1.0, 0.5, 0.05]} />
                <meshStandardMaterial color="#004d40" roughness={0.5} />
            </mesh>

            <group position={[-0.23, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
                    <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.115, 0]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.01, 24]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.005, 16]} />
                    <meshBasicMaterial color="#333" wireframe />
                </mesh>
            </group>

            <group position={[0.23, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
                    <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.115, 0]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.01, 24]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.005, 16]} />
                    <meshBasicMaterial color="#333" wireframe />
                </mesh>
            </group>

            <mesh position={[0, 0.12, 0.04]} castShadow>
                <boxGeometry args={[0.18, 0.08, 0.04]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
            </mesh>

            <mesh position={[0, -0.21, -0.05]} castShadow>
                <boxGeometry args={[0.3, 0.06, 0.1]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            {[...Array(4)].map((_, i) => {
                const xOffset = -0.12 + i * 0.08;
                return (
                    <mesh key={i} position={[xOffset, -0.22, -0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
                        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
                    </mesh>
                );
            })}

            {selected && (
                <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.6, 0.65, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0] }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'sensor';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('sensor', pin); }}>
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#ffc107"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, -0.2, 0]} center>
                            <div className="pin-tag-tooltip">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity RGB LED Model with Customizable Colors and Programmatic Emissive Glow
const LEDComponent = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource, color = 'red', isPowered = false }) => {
    const pins = ['Cathode', 'Anode'];
    const glowRef = useRef();

    const colorHexes = {
        red: '#ff3333',
        green: '#3fb950',
        blue: '#0066cc',
        yellow: '#ffc107'
    };
    const glowColor = colorHexes[color] || colorHexes.red;

    useFrame((state) => {
        if (glowRef.current && isPowered) {
            glowRef.current.emissiveIntensity = 3.5 + Math.sin(state.clock.getElapsedTime() * 6.0) * 0.4;
        } else if (glowRef.current) {
            glowRef.current.emissiveIntensity = 0;
        }
    });

    return (
        <group onClick={onClick}>
            {/* LED Cathode rim */}
            <mesh position={[0, -0.05, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
                <meshPhysicalMaterial 
                    color={glowColor} roughness={0.15} metalness={0.1}
                    transparent opacity={0.8} transmission={0.7} thickness={0.4}
                />
            </mesh>

            {/* LED Dome Body */}
            <mesh position={[0, 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.14, 0.18, 16]} />
                <meshPhysicalMaterial 
                    ref={glowRef}
                    color={glowColor} roughness={0.15} metalness={0.1}
                    transparent opacity={0.8} transmission={0.7} thickness={0.4}
                    emissive={glowColor} emissiveIntensity={isPowered ? 3.5 : 0}
                />
            </mesh>
            <mesh position={[0, 0.14, 0]} castShadow>
                <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial 
                    color={glowColor} roughness={0.15} metalness={0.1}
                    transparent opacity={0.8} transmission={0.7} thickness={0.4}
                    emissive={glowColor} emissiveIntensity={isPowered ? 3.5 : 0}
                />
            </mesh>

            {/* Internal Metal Anvil & Post */}
            <mesh position={[-0.04, 0.03, 0]} castShadow>
                <boxGeometry args={[0.06, 0.12, 0.02]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.04, 0.02, 0]} castShadow>
                <boxGeometry args={[0.02, 0.08, 0.02]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Straight Cathode Lead (-) */}
            <mesh position={[-0.08, -0.175, 0]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.25, 8]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Bent Anode Lead (+) */}
            {/* segment 1: down */}
            <mesh position={[0.08, -0.09, 0]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.08, 8]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* segment 2: diagonal bend */}
            <mesh position={[0.08, -0.14, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.06, 8]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* segment 3: straight down */}
            <mesh position={[0.08, -0.22, 0]} castShadow>
                <cylinderGeometry args={[0.016, 0.016, 0.16, 8]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>

            {selected && (
                <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.25, 0.28, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type: 'led' }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'led';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('led', pin); }}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : (pin === 'Anode' ? "#ff3333" : "#0066cc")} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, -0.15, 0]} center>
                            <div className={`pin-tag-tooltip ${pin === 'Anode' ? 'anode-tag' : 'cathode-tag'}`}>{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity Resistor Model with 4-Band Procedural Real-time Color Bands
const ResistorComponent = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource, value = 220 }) => {
    const pins = ['Pin A', 'Pin B'];

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

    const bands = getResistorColors(value);

    return (
        <group onClick={onClick}>
            {/* Silver Leads */}
            <mesh position={[-0.41, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.41, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Resistor Main Body (Beige Cylinder) */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.45, 16]} />
                <meshStandardMaterial color="#e6c280" roughness={0.4} metalness={0.1} />
            </mesh>

            {/* Procedural Color Bands */}
            <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.083, 0.083, 0.03, 16]} />
                <meshStandardMaterial color={bands[0]} roughness={0.3} />
            </mesh>
            <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.083, 0.083, 0.03, 16]} />
                <meshStandardMaterial color={bands[1]} roughness={0.3} />
            </mesh>
            <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.083, 0.083, 0.03, 16]} />
                <meshStandardMaterial color={bands[2]} roughness={0.3} />
            </mesh>
            <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.083, 0.083, 0.03, 16]} />
                <meshStandardMaterial color={bands[3]} metalness={0.8} roughness={0.2} />
            </mesh>

            {selected && (
                <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.65, 0.7, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type: 'resistor' }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'resistor';

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick('resistor', pin); }}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#58a6ff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.15, 0]} center>
                            <div className="pin-tag-tooltip">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium High-Fidelity Solderless Breadboard Model with Labeled Grid and Dynamic Interactive Connected Row Hover Highlights
const BreadboardComponent = ({ position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const [hoveredPin, setHoveredPin] = useState(null);

    const pins = [
        '+ Rail (L)', '- Rail (L)', '+ Rail (R)', '- Rail (R)',
        'Row 1 (A)', 'Row 1 (B)', 'Row 5 (A)', 'Row 5 (B)',
        'Row 10 (A)', 'Row 10 (B)', 'Row 15 (A)', 'Row 15 (B)',
        'Row 20 (A)', 'Row 20 (B)', 'Row 25 (A)', 'Row 25 (B)',
        'Row 30 (A)', 'Row 30 (B)'
    ];

    const getHighlightParams = (pin) => {
        if (!pin) return null;
        if (pin === '+ Rail (L)') return { pos: [0, 0.065, -0.6], args: [3.4, 0.015, 0.08] };
        if (pin === '- Rail (L)') return { pos: [0, 0.065, -0.4], args: [3.4, 0.015, 0.08] };
        if (pin === '+ Rail (R)') return { pos: [0, 0.065, 0.4], args: [3.4, 0.015, 0.08] };
        if (pin === '- Rail (R)') return { pos: [0, 0.065, 0.6], args: [3.4, 0.015, 0.08] };

        const match = pin.match(/Row (\d+) \(([AB])\)/);
        if (match) {
            const rowNum = parseInt(match[1]);
            const sect = match[2];
            const xOffset = -1.5 + ((rowNum - 1) / 29) * 3.0;
            const zOffset = sect === 'A' ? -0.2 : 0.2;
            return { pos: [xOffset, 0.065, zOffset], args: [0.08, 0.015, 0.35] };
        }
        return null;
    };

    const highlight = getHighlightParams(hoveredPin);

    return (
        <group onClick={onClick}>
            {/* ABS Off-White Plastic Base */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[3.8, 0.12, 1.6]} />
                <meshStandardMaterial color="#f6f6f8" roughness={0.35} metalness={0.05} />
            </mesh>

            {/* Central Division Gutter */}
            <mesh position={[0, 0.055, 0]} castShadow>
                <boxGeometry args={[3.6, 0.02, 0.08]} />
                <meshStandardMaterial color="#2d3139" roughness={0.7} />
            </mesh>

            {/* Power Rail Lines (Red/Blue Stripes) */}
            <mesh position={[0, 0.061, -0.7]}>
                <boxGeometry args={[3.4, 0.002, 0.015]} />
                <meshBasicMaterial color="#ff3333" />
            </mesh>
            <mesh position={[0, 0.061, -0.5]}>
                <boxGeometry args={[3.4, 0.002, 0.015]} />
                <meshBasicMaterial color="#0066cc" />
            </mesh>
            <mesh position={[0, 0.061, 0.5]}>
                <boxGeometry args={[3.4, 0.002, 0.015]} />
                <meshBasicMaterial color="#ff3333" />
            </mesh>
            <mesh position={[0, 0.061, 0.7]}>
                <boxGeometry args={[3.4, 0.002, 0.015]} />
                <meshBasicMaterial color="#0066cc" />
            </mesh>

            {/* Visual representation of grid columns */}
            {[...Array(30)].map((_, i) => {
                const xOffset = -1.5 + (i * 0.103);
                return (
                    <group key={i} position={[xOffset, 0.061, 0]}>
                        {/* Upper 5 terminal holes */}
                        {[...Array(5)].map((_, j) => (
                            <mesh key={`up-${j}`} position={[0, 0, -0.12 - j * 0.055]}>
                                <boxGeometry args={[0.035, 0.002, 0.035]} />
                                <meshStandardMaterial color="#30363d" roughness={0.9} />
                            </mesh>
                        ))}
                        {/* Lower 5 terminal holes */}
                        {[...Array(5)].map((_, j) => (
                            <mesh key={`down-${j}`} position={[0, 0, 0.12 + j * 0.055]}>
                                <boxGeometry args={[0.035, 0.002, 0.035]} />
                                <meshStandardMaterial color="#30363d" roughness={0.9} />
                            </mesh>
                        ))}
                    </group>
                );
            })}

            {/* Row index markings */}
            {[1, 5, 10, 15, 20, 25, 30].map(rowNum => {
                const xOffset = -1.5 + ((rowNum - 1) / 29) * 3.0;
                return (
                    <group key={`lbl-${rowNum}`}>
                        <Html distanceFactor={4} position={[xOffset, 0.07, -0.05]} center>
                            <div className="breadboard-grid-label">{rowNum}</div>
                        </Html>
                        <Html distanceFactor={4} position={[xOffset, 0.07, 0.05]} center>
                            <div className="breadboard-grid-label">{rowNum}</div>
                        </Html>
                    </group>
                );
            })}

            {/* Active Green Connection Row Hover Highlight */}
            {highlight && (
                <mesh position={highlight.pos} castShadow={false} receiveShadow={false}>
                    <boxGeometry args={highlight.args} />
                    <meshBasicMaterial color="#3fb950" transparent opacity={0.4} depthWrite={false} />
                </mesh>
            )}

            {selected && (
                <mesh position={[0, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[2.0, 2.05, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type: 'breadboard' }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === 'breadboard';

                return (
                    <group key={pin} position={localPos}>
                        <mesh 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onPinClick('breadboard', pin); 
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredPin(pin);
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                setHoveredPin(null);
                            }}
                        >
                            <sphereGeometry args={[0.045, 16, 16]} />
                            <meshBasicMaterial 
                                color={isSelectedSource ? "#bc8cff" : (hoveredPin === pin ? "#3fb950" : "#58a6ff")} 
                                transparent 
                                opacity={hoveredPin === pin ? 0.95 : 0.75} 
                            />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}>
                            <div className="pin-tag-tooltip breadboard-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium Procedural 3D model for DIP Integrated Circuits (e.g. attiny85, ne555, 74hc595, gate_and, l293d)
const DIPICComponent = ({ compId, type, name, position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const info = getNormalizedComponentInfo({ type, name });
    const pinCount = info.pinCount || 8;
    const displayName = info.label;

    const spacing = 0.11;
    const half = pinCount / 2;
    const width = (half - 1) * spacing + 0.18;
    const pins = Array.from({ length: pinCount }, (_, i) => `Pin ${i + 1}`);

    return (
        <group onClick={onClick}>
            {/* Plastic Chip Package */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[width, 0.08, 0.28]} />
                <meshStandardMaterial color="#1e1e20" roughness={0.7} metalness={0.15} />
            </mesh>

            {/* Top Notch for pin 1 orientation */}
            <mesh position={[-width / 2 + 0.015, 0.02, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.05, 12, 1, false, 0, Math.PI]} rotation={[0, -Math.PI / 2, 0]} />
                <meshStandardMaterial color="#141416" roughness={0.9} />
            </mesh>

            {/* Silkscreen text identifier */}
            <Html transform occlude distanceFactor={1.2} position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div className="ic-top-label" style={{ 
                    color: 'rgba(255, 255, 255, 0.65)', 
                    fontFamily: 'monospace', 
                    fontSize: '9px', 
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    width: '60px'
                }}>
                    {displayName}
                </div>
            </Html>

            {/* Metal Solder Legs/Pins */}
            {Array.from({ length: pinCount }).map((_, i) => {
                const pinNum = i + 1;
                const isLeftSide = pinNum <= half;
                const zOffset = isLeftSide ? -0.14 : 0.14;
                const indexOnSide = isLeftSide ? pinNum - 1 : half - (pinNum - half);
                const xOffset = -((half - 1) * spacing) / 2 + indexOnSide * spacing;

                return (
                    <group key={i} position={[xOffset, -0.04, zOffset]}>
                        <mesh position={[0, 0.02, isLeftSide ? 0.02 : -0.02]} castShadow>
                            <boxGeometry args={[0.022, 0.015, 0.04]} />
                            <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                        </mesh>
                        <mesh position={[0, -0.04, isLeftSide ? 0.04 : -0.04]} castShadow>
                            <boxGeometry args={[0.015, 0.1, 0.01]} />
                            <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                        </mesh>
                    </group>
                );
            })}

            {selected && (
                <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[width / 2 + 0.05, width / 2 + 0.1, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === compId;

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick(type, pin); }}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#58a6ff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.16, 0]} center>
                            <div className="pin-tag-tooltip ic-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium Procedural 3D model for Discrete components (e.g. potentiometer, capacitor_ceramic, capacitor_electrolytic, diode, transistor, ldr)
const DiscreteComponent = ({ compId, type, name, position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = [];
    if (type === 'potentiometer') pins.push('Pin 1', 'Pin 2', 'Pin 3');
    else if (type === 'transistor') pins.push('Emitter', 'Base', 'Collector');
    else if (type === 'capacitor_electrolytic') pins.push('-', '+');
    else if (type === 'diode') pins.push('Anode', 'Cathode');
    else pins.push('Pin A', 'Pin B'); // ldr, capacitor_ceramic

    let visual = null;

    if (type === 'potentiometer') {
        visual = (
            <group>
                {/* Potentiometer body/base (Blue casing with metal top bracket) */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.42, 0.3, 0.42]} />
                    <meshStandardMaterial color="#0b5ed7" roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.16, 0]} castShadow>
                    <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
                    <meshStandardMaterial color="#8f9aa9" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Rotatable metal shaft */}
                <mesh position={[0, 0.28, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 0.22, 16]} />
                    <meshStandardMaterial color="#b1bac4" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Knob with red direction marker */}
                <mesh position={[0, 0.38, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.38, 0.06]} castShadow>
                    <boxGeometry args={[0.015, 0.045, 0.04]} />
                    <meshBasicMaterial color="#ff3333" />
                </mesh>
                {/* Three metallic solder lugs */}
                {[-0.15, 0, 0.15].map((x, idx) => (
                    <mesh key={idx} position={[x, -0.18, 0.1]} castShadow>
                        <boxGeometry args={[0.04, 0.08, 0.015]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                    </mesh>
                ))}
            </group>
        );
    } else if (type === 'transistor') {
        visual = (
            <group>
                {/* TO-92 black D-shaped case */}
                <group scale={[1.1, 1, 0.85]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.12, 0.12, 0.26, 16, 1, false, 0, Math.PI]} />
                        <meshStandardMaterial color="#1f2328" roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0, 0.001]} castShadow receiveShadow>
                        <boxGeometry args={[0.24, 0.26, 0.02]} />
                        <meshStandardMaterial color="#21262d" roughness={0.5} />
                    </mesh>
                </group>
                {/* Three silver leads extending downwards */}
                {[-0.08, 0, 0.08].map((x, idx) => (
                    <mesh key={idx} position={[x, -0.2, 0]} castShadow>
                        <cylinderGeometry args={[0.009, 0.009, 0.22, 8]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                    </mesh>
                ))}
            </group>
        );
    } else if (type === 'capacitor_ceramic') {
        visual = (
            <group>
                {/* Ceramic disc orange drop */}
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.1, 0.1, 0.035, 16]} />
                    <meshStandardMaterial color="#ea7a30" roughness={0.8} />
                </mesh>
                {/* Solder leads */}
                {[-0.05, 0.05].map((x, idx) => (
                    <mesh key={idx} position={[x, -0.16, 0]} castShadow>
                        <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
                    </mesh>
                ))}
            </group>
        );
    } else if (type === 'capacitor_electrolytic') {
        visual = (
            <group>
                {/* Cylindrical blue aluminum casing */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.085, 0.085, 0.22, 16]} />
                    <meshStandardMaterial color="#0d6efd" roughness={0.4} />
                </mesh>
                {/* Top aluminum metal plate */}
                <mesh position={[0, 0.111, 0]} castShadow>
                    <cylinderGeometry args={[0.082, 0.082, 0.002, 16]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Negative polarity stripe (Grey box overlay) */}
                <mesh position={[-0.062, 0, 0]} castShadow>
                    <boxGeometry args={[0.02, 0.218, 0.04]} />
                    <meshStandardMaterial color="#8f9aa9" roughness={0.5} />
                </mesh>
                {/* Leads */}
                {[-0.04, 0.04].map((x, idx) => (
                    <mesh key={idx} position={[x, -0.18, 0]} castShadow>
                        <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
                    </mesh>
                ))}
            </group>
        );
    } else if (type === 'diode') {
        visual = (
            <group rotation={[0, 0, Math.PI / 2]}>
                {/* Rectifier black cylinder */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.06, 0.06, 0.24, 16]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.5} />
                </mesh>
                {/* Silver Cathode ring */}
                <mesh position={[0, 0.075, 0]} castShadow>
                    <cylinderGeometry args={[0.061, 0.061, 0.03, 16]} />
                    <meshStandardMaterial color="#c0c0c0" roughness={0.3} />
                </mesh>
                {/* Dual horizontal leads */}
                <mesh position={[0, -0.22, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                </mesh>
                <mesh position={[0, 0.22, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                </mesh>
            </group>
        );
    } else if (type === 'ldr') {
        visual = (
            <group>
                {/* Ceramic disc base */}
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
                    <meshStandardMaterial color="#f6f8fa" roughness={0.5} />
                </mesh>
                {/* Red photo-sensitive serpentine track */}
                <mesh position={[0, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.002, 16]} />
                    <meshBasicMaterial color="#df382c" wireframe />
                </mesh>
                {/* Ceramic leads */}
                {[-0.05, 0.05].map((x, idx) => (
                    <mesh key={idx} position={[x, -0.15, 0]} castShadow>
                        <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
                        <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                    </mesh>
                ))}
            </group>
        );
    }

    return (
        <group onClick={onClick}>
            {visual}

            {selected && (
                <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.26, 0.31, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === compId;

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick(type, pin); }}>
                            <sphereGeometry args={[0.045, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#58a6ff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}>
                            <div className="pin-tag-tooltip discrete-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium Procedural 3D model for Power components (e.g. battery_9v, battery_aa)
const PowerComponent = ({ compId, type, position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const pins = ['-', '+'];
    let visual = null;

    if (type === 'battery_9v') {
        visual = (
            <group>
                {/* 9V battery body casing */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.48, 0.72, 0.32]} />
                    <meshStandardMaterial color="#21262d" roughness={0.5} />
                </mesh>
                {/* Top dynamic golden-orange collar */}
                <mesh position={[0, 0.28, 0]} castShadow>
                    <boxGeometry args={[0.482, 0.16, 0.322]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Hexagonal female snap terminal */}
                <mesh position={[0.12, 0.38, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.05, 6]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                </mesh>
                {/* Circular male snap terminal */}
                <mesh position={[-0.12, 0.38, 0]} castShadow>
                    <cylinderGeometry args={[0.07, 0.07, 0.05, 12]} />
                    <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.05} />
                </mesh>

                <Html transform occlude distanceFactor={1.2} position={[0, 0, 0.162]} style={{ pointerEvents: 'none' }}>
                    <div className="battery-9v-label" style={{ 
                        color: '#ffffff', 
                        fontFamily: 'sans-serif', 
                        fontSize: '9px', 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        width: '50px'
                    }}>
                        9V Heavy
                    </div>
                </Html>
            </group>
        );
    } else if (type === 'battery_aa') {
        visual = (
            <group>
                {/* AA Battery Holder Frame */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.62, 0.14, 0.62]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.04, 0]} castShadow>
                    <boxGeometry args={[0.02, 0.08, 0.58]} />
                    <meshStandardMaterial color="#161b22" />
                </mesh>
                {/* Battery Cell 1 (Left side, oriented + back) */}
                <group position={[-0.14, 0.05, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
                        <meshStandardMaterial color="#1a1f26" roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.091, 0.091, 0.24, 16]} />
                        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, -0.26]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
                        <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
                {/* Battery Cell 2 (Right side, oriented + front) */}
                <group position={[0.14, 0.05, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
                        <meshStandardMaterial color="#1a1f26" roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.091, 0.091, 0.24, 16]} />
                        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
                        <meshStandardMaterial color="#eeeeee" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
            </group>
        );
    }

    return (
        <group onClick={onClick}>
            {visual}

            {selected && (
                <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.42, 0.47, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === compId;

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick(type, pin); }}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : (pin === '+' ? "#ff3333" : "#0066cc")} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}>
                            <div className={`pin-tag-tooltip ${pin === '+' ? 'anode-tag' : 'cathode-tag'}`}>{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Premium Procedural 3D model for breakout boards, actuators, and generic modules
const GenericModuleComponent = ({ compId, type, name, position, scale, selected, onClick, isWiringMode, onPinClick, activeWiringSource }) => {
    const [hoveredPin, setHoveredPin] = useState(null);
    let pins = [];
    if (type === 'pico') pins = ['3V3', 'GND', 'GP2', 'GP3', 'VSYS'];
    else if (type === 'relay') pins = ['VCC', 'GND', 'SIG'];
    else if (type === 'pir') pins = ['VCC', 'GND', 'OUT'];
    else if (type === 'soil') pins = ['VCC', 'GND', 'SIG'];
    else if (type === 'gyro') pins = ['VCC', 'GND', 'SCL', 'SDA', 'INT'];
    else if (type === 'lcd1602') pins = ['VCC', 'GND', 'SCL', 'SDA'];
    else if (type === 'dc_motor') pins = ['Pin A', 'Pin B'];
    else if (type === 'stepper') pins = ['VCC', 'GND', 'SIG'];
    else if (type === 'buzzer') pins = ['-', '+'];
    else if (type === 'breadboard_mini') {
        pins = [
            '+ Rail (L)', '- Rail (L)', '+ Rail (R)', '- Rail (R)',
            'Row 1 (A)', 'Row 1 (B)', 'Row 5 (A)', 'Row 5 (B)',
            'Row 10 (A)', 'Row 10 (B)', 'Row 15 (A)', 'Row 15 (B)'
        ];
    }

    let visual = null;

    if (type === 'pico') {
        visual = (
            <group>
                {/* Raspberry Pi Pico green PCB */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.3, 0.04, 0.52]} />
                    <meshStandardMaterial color="#0c562e" roughness={0.5} />
                </mesh>
                {/* USB Connector */}
                <mesh position={[-0.6, 0.06, 0]} castShadow>
                    <boxGeometry args={[0.16, 0.08, 0.16]} />
                    <meshStandardMaterial color="#dcdcdc" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Main silicon RP2040 chip */}
                <mesh position={[0, 0.04, 0]} castShadow>
                    <boxGeometry args={[0.18, 0.02, 0.18]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.8} />
                </mesh>
                {/* Golden edge strip pads */}
                {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((x, idx) => (
                    <group key={idx}>
                        <mesh position={[x, 0.022, -0.25]} castShadow>
                            <boxGeometry args={[0.02, 0.005, 0.02]} />
                            <meshStandardMaterial color="#d4af37" metalness={0.9} />
                        </mesh>
                        <mesh position={[x, 0.022, 0.25]} castShadow>
                            <boxGeometry args={[0.02, 0.005, 0.02]} />
                            <meshStandardMaterial color="#d4af37" metalness={0.9} />
                        </mesh>
                    </group>
                ))}
            </group>
        );
    } else if (type === 'relay') {
        visual = (
            <group>
                {/* Breakout green PCB */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.62, 0.04, 0.42]} />
                    <meshStandardMaterial color="#0f3d1b" roughness={0.6} />
                </mesh>
                {/* Blue Relay casing */}
                <mesh position={[0.08, 0.18, 0]} castShadow>
                    <boxGeometry args={[0.38, 0.32, 0.32]} />
                    <meshStandardMaterial color="#0d6efd" roughness={0.4} />
                </mesh>
                {/* Screw Terminal Block */}
                <mesh position={[-0.22, 0.1, 0]} castShadow>
                    <boxGeometry args={[0.18, 0.16, 0.32]} />
                    <meshStandardMaterial color="#198754" roughness={0.5} />
                </mesh>
                {/* Screw terminals */}
                {[-0.1, 0, 0.1].map((z, idx) => (
                    <mesh key={idx} position={[-0.22, 0.18, z]} castShadow>
                        <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
                        <meshStandardMaterial color="#8f9aa9" metalness={0.9} />
                    </mesh>
                ))}
            </group>
        );
    } else if (type === 'pir') {
        visual = (
            <group>
                {/* Breakout PCB */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.54, 0.04, 0.54]} />
                    <meshStandardMaterial color="#0f3d1b" roughness={0.6} />
                </mesh>
                {/* Fresnel white Dome lens */}
                <mesh position={[0, 0.18, 0]} castShadow>
                    <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#f6f8fa" roughness={0.6} opacity={0.9} transparent />
                </mesh>
            </group>
        );
    } else if (type === 'soil') {
        visual = (
            <group>
                {/* Breakout base plate */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.38, 0.04, 0.22]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.6} />
                </mesh>
                {/* Fork Prongs */}
                <mesh position={[-0.09, -0.32, 0]} castShadow>
                    <boxGeometry args={[0.04, 0.6, 0.02]} />
                    <meshStandardMaterial color="#21262d" roughness={0.5} />
                </mesh>
                <mesh position={[0.09, -0.32, 0]} castShadow>
                    <boxGeometry args={[0.04, 0.6, 0.02]} />
                    <meshStandardMaterial color="#21262d" roughness={0.5} />
                </mesh>
                {/* Gold-plated trace contacts */}
                <mesh position={[-0.09, -0.32, 0.012]} castShadow>
                    <boxGeometry args={[0.015, 0.52, 0.002]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[0.09, -0.32, 0.012]} castShadow>
                    <boxGeometry args={[0.015, 0.52, 0.002]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        );
    } else if (type === 'gyro') {
        visual = (
            <group>
                {/* Purple breakout PCB */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.42, 0.04, 0.42]} />
                    <meshStandardMaterial color="#6f42c1" roughness={0.6} />
                </mesh>
                {/* Sensor accelerometer chip */}
                <mesh position={[0, 0.03, 0]} castShadow>
                    <boxGeometry args={[0.15, 0.02, 0.15]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.8} />
                </mesh>
            </group>
        );
    } else if (type === 'lcd1602') {
        visual = (
            <group>
                {/* Character green LCD PCB carrier */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.8, 0.04, 0.72]} />
                    <meshStandardMaterial color="#0f3d1b" roughness={0.6} />
                </mesh>
                {/* LCD metallic display bezel */}
                <mesh position={[0, 0.05, 0]} castShadow>
                    <boxGeometry args={[1.5, 0.06, 0.52]} />
                    <meshStandardMaterial color="#30363d" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Reflective yellowish screen background */}
                <mesh position={[0, 0.082, 0]} castShadow>
                    <boxGeometry args={[1.32, 0.01, 0.4]} />
                    <meshStandardMaterial color="#a7c900" roughness={0.1} />
                </mesh>
                {/* Dynamic Projected Live Characters */}
                <Html transform occlude distanceFactor={1.5} position={[0, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]} style={{ pointerEvents: 'none' }}>
                    <div className="lcd1602-screen-content" style={{
                        color: '#000000',
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        lineHeight: '1.2',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        padding: '2px',
                        width: '120px'
                    }}>
                        <div>* KONE LABS v1.3 *</div>
                        <div>SYSTEM SIM ACTIVE</div>
                    </div>
                </Html>
            </group>
        );
    } else if (type === 'dc_motor') {
        visual = (
            <group rotation={[0, 0, Math.PI / 2]}>
                {/* Cylindrical metal canister */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.18, 0.18, 0.38, 16]} />
                    <meshStandardMaterial color="#b1bac4" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Orange terminal plastic rear cover */}
                <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]} castShadow>
                    <sphereGeometry args={[0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#ea580c" roughness={0.6} />
                </mesh>
                {/* Axial metal drive shaft */}
                <mesh position={[0, 0.28, 0]} castShadow>
                    <cylinderGeometry args={[0.03, 0.03, 0.2, 12]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>
        );
    } else if (type === 'stepper') {
        visual = (
            <group>
                {/* Heavy motor body housing */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.42, 0.42, 0.42]} />
                    <meshStandardMaterial color="#8f9aa9" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Brass gear/collar */}
                <mesh position={[0, 0.22, 0]} castShadow>
                    <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.9} />
                </mesh>
                {/* Central shaft */}
                <mesh position={[0, 0.32, 0]} castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.16, 12]} />
                    <meshStandardMaterial color="#dcdcdc" metalness={0.95} roughness={0.1} />
                </mesh>
            </group>
        );
    } else if (type === 'buzzer') {
        visual = (
            <group>
                {/* Round black piezo drum cover */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[0.18, 0.18, 0.16, 16]} />
                    <meshStandardMaterial color="#1f2328" roughness={0.6} />
                </mesh>
                {/* Central audio outlet port */}
                <mesh position={[0, 0.082, 0]} castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.005, 12]} />
                    <meshStandardMaterial color="#101214" roughness={0.9} />
                </mesh>
                {/* Decal indicator mark */}
                <Html transform occlude distanceFactor={1.2} position={[0.09, 0.083, 0.06]} rotation={[-Math.PI / 2, 0, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px', fontWeight: 'bold' }}>+</div>
                </Html>
            </group>
        );
    } else if (type === 'breadboard_mini') {
        const miniGridCols = 15;

        const getHighlightParams = (pin) => {
            if (!pin) return null;
            if (pin === '+ Rail (L)') return { pos: [0, 0.065, -0.35], args: [1.6, 0.015, 0.06] };
            if (pin === '- Rail (L)') return { pos: [0, 0.065, -0.25], args: [1.6, 0.015, 0.06] };
            if (pin === '+ Rail (R)') return { pos: [0, 0.065, 0.25], args: [1.6, 0.015, 0.06] };
            if (pin === '- Rail (R)') return { pos: [0, 0.065, 0.35], args: [1.6, 0.015, 0.06] };

            const match = pin.match(/Row (\d+) \(([AB])\)/);
            if (match) {
                const rowNum = parseInt(match[1]);
                const sect = match[2];
                const xOffset = -0.8 + ((rowNum - 1) / 14) * 1.6;
                const zOffset = sect === 'A' ? -0.1 : 0.1;
                return { pos: [xOffset, 0.065, zOffset], args: [0.06, 0.015, 0.18] };
            }
            return null;
        };

        const highlight = getHighlightParams(hoveredPin);

        visual = (
            <group>
                {/* ABS Off-White Miniature Board Base */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.9, 0.12, 0.95]} />
                    <meshStandardMaterial color="#f6f8fa" roughness={0.35} metalness={0.05} />
                </mesh>
                {/* Central gutter division channel */}
                <mesh position={[0, 0.055, 0]} castShadow>
                    <boxGeometry args={[1.8, 0.02, 0.05]} />
                    <meshStandardMaterial color="#30363d" roughness={0.7} />
                </mesh>
                {/* Breadboard mini terminal pinout grids */}
                {Array.from({ length: miniGridCols }).map((_, i) => {
                    const xOffset = -0.8 + (i * 0.114);
                    return (
                        <group key={i} position={[xOffset, 0.061, 0]}>
                            {Array.from({ length: 5 }).map((_, j) => (
                                <mesh key={`up-${j}`} position={[0, 0, -0.08 - j * 0.045]}>
                                    <boxGeometry args={[0.03, 0.002, 0.03]} />
                                    <meshStandardMaterial color="#21262d" roughness={0.9} />
                                </mesh>
                            ))}
                            {Array.from({ length: 5 }).map((_, j) => (
                                <mesh key={`down-${j}`} position={[0, 0, 0.08 + j * 0.045]}>
                                    <boxGeometry args={[0.03, 0.002, 0.03]} />
                                    <meshStandardMaterial color="#21262d" roughness={0.9} />
                                </mesh>
                            ))}
                        </group>
                    );
                })}

                {highlight && (
                    <mesh position={highlight.pos} castShadow={false} receiveShadow={false}>
                        <boxGeometry args={highlight.args} />
                        <meshBasicMaterial color="#3fb950" transparent opacity={0.4} depthWrite={false} />
                    </mesh>
                )}

                {pins.map(pin => {
                    const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type: 'breadboard_mini' }, pin);
                    const localPos = [
                        (pos[0] - position[0]) / scale,
                        (pos[1] - position[1]) / scale,
                        (pos[2] - position[2]) / scale
                    ];
                    const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === compId;

                    return (
                        <group key={pin} position={localPos}>
                            <mesh 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    onPinClick(type, pin); 
                                }}
                                onPointerOver={(e) => {
                                    e.stopPropagation();
                                    setHoveredPin(pin);
                                }}
                                onPointerOut={(e) => {
                                    e.stopPropagation();
                                    setHoveredPin(null);
                                }}
                            >
                                <sphereGeometry args={[0.038, 16, 16]} />
                                <meshBasicMaterial 
                                    color={isSelectedSource ? "#bc8cff" : (hoveredPin === pin ? "#3fb950" : "#58a6ff")} 
                                    transparent 
                                    opacity={hoveredPin === pin ? 0.95 : 0.75} 
                                />
                            </mesh>
                        </group>
                    );
                })}
            </group>
        );
    }

    return (
        <group onClick={onClick}>
            {visual}

            {selected && type !== 'breadboard_mini' && (
                <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.45, 0.5, 32]} />
                    <meshBasicMaterial color="#58a6ff" side={THREE.DoubleSide} />
                </mesh>
            )}

            {(isWiringMode || selected) && type !== 'breadboard_mini' && pins.map(pin => {
                const pos = getPinWorldPosition({ position, scale, rotation: [0,0,0], type }, pin);
                const localPos = [
                    (pos[0] - position[0]) / scale,
                    (pos[1] - position[1]) / scale,
                    (pos[2] - position[2]) / scale
                ];
                const isSelectedSource = activeWiringSource && activeWiringSource.pin === pin && activeWiringSource.compId === compId;

                return (
                    <group key={pin} position={localPos}>
                        <mesh onClick={(e) => { e.stopPropagation(); onPinClick(type, pin); }}>
                            <sphereGeometry args={[0.045, 16, 16]} />
                            <meshBasicMaterial color={isSelectedSource ? "#bc8cff" : "#58a6ff"} transparent opacity={0.8} />
                        </mesh>
                        <Html distanceFactor={4} position={[0, 0.18, 0]} center style={{ pointerEvents: 'none' }}>
                            <div className="pin-tag-tooltip module-tag">{pin}</div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
};

// Sub-wrapper component to enable direct 3D dragging using TransformControls
const PlacedComponent = ({ comp, selected, onClick, onUpdate, isWiringMode, onPinClick, activeWiringSource, setDragging, poweredLeds = {} }) => {
    const ref = useRef();

    useEffect(() => {
        if (ref.current) {
            ref.current.position.set(...comp.position);
            ref.current.rotation.set(...comp.rotation);
        }
    }, [comp.position, comp.rotation]);

    const props = {
        position: comp.position,
        scale: comp.scale,
        rotation: comp.rotation,
        selected,
        onClick,
        isWiringMode,
        onPinClick,
        activeWiringSource
    };

    const info = getNormalizedComponentInfo(comp);

    let renderedModel = null;
    switch (info.baseType) {
        case 'control': renderedModel = <ControlUnit {...props} />; break;
        case 'motor': renderedModel = <ServoMotor {...props} />; break;
        case 'sensor': renderedModel = <SensorPack {...props} />; break;
        case 'esp32': renderedModel = <ESP32Board {...props} />; break;
        case 'oled': renderedModel = <OLEDDisplay {...props} />; break;
        case 'dht11': renderedModel = <DHT11Sensor {...props} />; break;
        case 'led': renderedModel = <LEDComponent {...props} color={info.color} isPowered={poweredLeds[comp.id] === true} />; break;
        case 'resistor': renderedModel = <ResistorComponent {...props} value={comp.value || info.value} />; break;
        case 'breadboard': renderedModel = <BreadboardComponent {...props} />; break;
        case 'pico': renderedModel = <GenericModuleComponent {...props} compId={comp.id} type="pico" name="RPi Pico" />; break;
        case 'dip_ic':
            renderedModel = <DIPICComponent {...props} compId={comp.id} type={comp.type} name={info.label} />;
            break;
        case 'capacitor_ceramic':
        case 'capacitor_electrolytic':
        case 'diode':
        case 'transistor':
        case 'potentiometer':
        case 'ldr':
            renderedModel = <DiscreteComponent {...props} compId={comp.id} type={info.baseType} name={info.label} value={comp.value || info.value} />;
            break;
        case 'battery_9v':
        case 'battery_aa':
            renderedModel = <PowerComponent {...props} compId={comp.id} type={info.baseType} />;
            break;
        case 'relay':
        case 'pir':
        case 'soil':
        case 'gyro':
        case 'lcd1602':
        case 'dc_motor':
        case 'stepper':
        case 'buzzer':
        case 'breadboard_mini':
            renderedModel = <GenericModuleComponent {...props} compId={comp.id} type={info.baseType} name={info.label} />;
            break;
        default: return null;
    }

    return (
        <group>
            <group ref={ref}>
                {renderedModel}
            </group>

            {selected && !isWiringMode && (
                <Html distanceFactor={3.5} position={[comp.position[0], comp.position[1] + 0.45, comp.position[2]]} center style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(13, 17, 23, 0.92)',
                        border: '1px solid rgba(188, 140, 255, 0.75)',
                        boxShadow: '0 0 16px rgba(188, 140, 255, 0.35)',
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    }}>
                        <span style={{ color: '#bc8cff', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                            {info.baseType.replace('_', ' ')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {comp.name} {comp.value ? <span style={{ color: '#58a6ff' }}>({comp.value}{comp.type === 'resistor' ? ' Ω' : ''})</span> : ''}
                        </span>
                    </div>
                </Html>
            )}

            {selected && !isWiringMode && ref.current && (
                <TransformControls
                    object={ref}
                    mode="translate"
                    showY={false} // Lock vertical dragging (stay on flat table grid!)
                    onPointerDown={() => setDragging(true)}
                    onPointerUp={() => setDragging(false)}
                    onChange={() => {
                        if (ref.current) {
                            const pos = ref.current.position;
                            onUpdate(comp.id, { position: [pos.x, pos.y, pos.z] });
                        }
                    }}
                />
            )}
        </group>
    );
};

// Procedural Curved 3D Wire with Moving Glowing Signal Pulse
const CurvedWire = ({ fromPos, toPos, color = "#ff3333", isPaused = false }) => {
    const pulseRef = useRef();
    const tubeRef = useRef();

    const pStart = new THREE.Vector3(...fromPos);
    const pEnd = new THREE.Vector3(...toPos);
    
    // 1. Calculate dynamic sag factor based on connection distance
    const distance = pStart.distanceTo(pEnd);
    const sag = Math.min(1.5, 0.15 + distance * 0.2);

    // 2. Define the 5 curve points for vertical entry and draped hang
    const v1 = pStart;
    const v2 = pStart.clone().add(new THREE.Vector3(0, 0.45, 0)); // Exits starting pin straight up
    const v5 = pEnd;
    const v4 = pEnd.clone().add(new THREE.Vector3(0, 0.45, 0)); // Enters destination pin straight down

    const midX = (v1.x + v5.x) / 2;
    const midY = Math.max(v1.y, v5.y) + 0.35 - sag;
    const midZ = (v1.z + v5.z) / 2;

    const baseCurve = new THREE.CatmullRomCurve3([
        v1,
        v2,
        new THREE.Vector3(midX, midY, midZ),
        v4,
        v5
    ]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const seed = fromPos[0] + fromPos[2] + toPos[0]; // Unique seed based on coordinates

        // 3. Compute organic real-time sway
        const swayX = Math.sin(time * 1.5 + seed) * 0.025;
        const swayZ = Math.cos(time * 1.2 + seed) * 0.025;

        const currentV3 = new THREE.Vector3(midX + swayX, midY, midZ + swayZ);
        const activeCurve = new THREE.CatmullRomCurve3([v1, v2, currentV3, v4, v5]);

        // 4. Directly update WebGL geometry buffer bypassing React (smooth 60fps)
        if (tubeRef.current) {
            // Dispose of old geometry memory to prevent GPU memory leaks
            tubeRef.current.geometry.dispose();
            tubeRef.current.geometry = new THREE.TubeGeometry(activeCurve, 32, 0.03, 8, false);
        }

        // 5. Align pulse sphere to the active swaying spline path
        if (pulseRef.current && !isPaused) {
            const pulseT = (time * 0.35) % 1;
            const pos = activeCurve.getPointAt(pulseT);
            pulseRef.current.position.copy(pos);
        }
    });

    return (
        <group>
            <mesh ref={tubeRef} castShadow receiveShadow>
                <tubeGeometry args={[baseCurve, 32, 0.03, 8, false]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
            </mesh>

            <mesh ref={pulseRef}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
};

const WorkshopScene = ({ 
    components = [], 
    connections = [],
    selectedId, 
    onSelect, 
    isPaused,
    isWiringMode,
    onPinClick,
    activeWiringSource,
    onUpdate,
    poweredLeds = {}
}) => {
    const [dragging, setDragging] = useState(false);

    return (
        <div className="workshop-viewport">
            <Canvas shadows className="canvas-container">
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 4, 5]} fov={50} />
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} enabled={!dragging} />
                    
                    {/* Render active hardware components as interactive draggable groups */}
                    {components.map((comp) => (
                        <PlacedComponent
                            key={comp.id}
                            comp={comp}
                            selected={comp.id === selectedId}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(comp.id);
                            }}
                            onUpdate={onUpdate}
                            isWiringMode={isWiringMode}
                            onPinClick={(type, pin) => onPinClick(comp.id, pin)}
                            activeWiringSource={activeWiringSource}
                            setDragging={setDragging}
                            poweredLeds={poweredLeds}
                        />
                    ))}

                    {/* Render 3D connection wires */}
                    {connections.map((conn) => {
                        const fromComp = components.find(c => c.id === conn.fromId);
                        const toComp = components.find(c => c.id === conn.toId);
                        if (!fromComp || !toComp) return null;

                        const fromPos = getPinWorldPosition(fromComp, conn.fromPin);
                        const toPos = getPinWorldPosition(toComp, conn.toPin);

                        return (
                            <CurvedWire 
                                key={conn.id} 
                                fromPos={fromPos} 
                                toPos={toPos} 
                                color={conn.color || '#ff3333'} 
                                isPaused={isPaused}
                            />
                        );
                    })}

                    {components.length === 0 && (
                        <mesh position={[0, 0.25, 0]}>
                            <boxGeometry args={[1, 0.5, 1]} />
                            <meshStandardMaterial color="#333" transparent opacity={0.3} wireframe />
                        </mesh>
                    )}

                    <Grid 
                        infiniteGrid 
                        fadeDistance={20} 
                        fadeStrength={1.5} 
                        cellSize={0.5} 
                        sectionSize={2.0} 
                        sectionColor="#58a6ff" 
                        sectionThickness={1.0} 
                        cellColor="#30363d" 
                        cellThickness={0.5}
                        position={[0, -0.05, 0]}
                    />
                    
                    <Environment preset="studio" />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                    <spotLight position={[5, 10, 5]} intensity={2.0} castShadow />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default WorkshopScene;
