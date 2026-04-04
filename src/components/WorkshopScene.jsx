import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stage, PerspectiveCamera, Environment, Float } from '@react-three/drei';

const ControlUnit = ({ position, scale, selected, onClick }) => (
    <mesh position={position} scale={scale} onClick={onClick}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial 
            color={selected ? "#0d6efd" : "#1a1a1b"} 
            metalness={0.9} 
            roughness={0.1} 
            emissive={selected ? "#0d6efd" : "#000"}
            emissiveIntensity={0.5}
        />
        {/* LED Indicator */}
        <mesh position={[0.4, 0.21, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} />
        </mesh>
    </mesh>
);

const ServoMotor = ({ position, scale, selected, onClick }) => (
    <group position={position} scale={scale} onClick={onClick}>
        <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 32]} />
            <meshStandardMaterial color={selected ? "#0d6efd" : "#333"} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.4]} />
            <meshStandardMaterial color="#555" />
        </mesh>
    </group>
);

const SensorPack = ({ position, scale, selected, onClick }) => (
    <mesh position={position} scale={scale} onClick={onClick}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
            color={selected ? "#0d6efd" : "#58a6ff"} 
            emissive="#58a6ff" 
            emissiveIntensity={selected ? 1 : 0.3}
            metalness={0.5}
            roughness={0.2}
        />
    </mesh>
);

const WorkshopScene = ({ components = [], selectedId, onSelect }) => {
    return (
        <div className="workshop-viewport">
            <Canvas shadows className="canvas-container">
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                    
                    <Stage environment="city" intensity={0.6} contactShadow={false}>
                        {components.map((comp) => {
                            const props = {
                                key: comp.id,
                                position: comp.position,
                                scale: comp.scale,
                                selected: comp.id === selectedId,
                                onClick: (e) => {
                                    e.stopPropagation();
                                    onSelect(comp.id);
                                }
                            };

                            switch (comp.type) {
                                case 'control': return <ControlUnit {...props} />;
                                case 'motor': return <ServoMotor {...props} />;
                                case 'sensor': return <SensorPack {...props} />;
                                default: return null;
                            }
                        })}
                        {components.length === 0 && (
                            <mesh position={[0, 0.5, 0]}>
                                <boxGeometry args={[1, 1, 1]} />
                                <meshStandardMaterial color="#333" transparent opacity={0.3} />
                            </mesh>
                        )}
                    </Stage>

                    <Grid 
                        infiniteGrid 
                        fadeDistance={50} 
                        fadeStrength={5} 
                        cellSize={1} 
                        sectionSize={5} 
                        sectionColor="#58a6ff" 
                        sectionThickness={1.5} 
                        cellColor="#30363d" 
                        cellThickness={0.8}
                    />
                    
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default WorkshopScene;
