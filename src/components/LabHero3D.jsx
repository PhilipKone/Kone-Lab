import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, ContactShadows, PresentationControls, Grid } from '@react-three/drei';

const GlassMaterial = ({ color = "#ffffff", opacity = 0.5, transmission = 1.0, thickness = 2 }) => (
    <meshPhysicalMaterial
        color={color}
        transmission={transmission}
        thickness={thickness}
        roughness={0.1}
        metalness={0.1}
        clearcoat={1}
        transparent={true}
        opacity={opacity}
        ior={1.45}
    />
);

const MachinedJoint = ({ position, rotation = [0, 0, 0] }) => (
    <group position={position} rotation={rotation}>
        {/* Mounting Plate: Creates a professional structural foundation */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.28, 0.1, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Ball Joint: Articulated look */}
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshPhysicalMaterial color="#AEC6FF" roughness={0.1} metalness={0.3} clearcoat={1} ior={1.6} />
        </mesh>
    </group>
);

const FloorGrid = () => {
    const gridRef = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Moving the grid backward (front to back) to simulate forward progress
        if (gridRef.current) {
            gridRef.current.position.z = -(t * 1.75) % 2;
        }
    });

    return (
        <group position={[0, -2.1, 0]} ref={gridRef}>
            <Grid
                infiniteGrid
                fadeDistance={20}
                fadeStrength={1}
                cellSize={1}
                sectionSize={2}
                sectionThickness={1}
                sectionColor="#58a6ff"
                cellColor="#1a202c"
                cellThickness={0.5}
            />
        </group>
    );
};

const Robot = () => {
    const headRef = useRef();
    const bodyRef = useRef();
    const lLegRef = useRef();
    const rLegRef = useRef();
    const lArmRef = useRef();
    const rArmRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const walkSpeed = 3.5;
        
        // Precise head movement
        if (headRef.current) {
            headRef.current.rotation.y = Math.sin(t * 0.7) * 0.15;
            headRef.current.rotation.x = Math.cos(t * 0.7) * 0.08;
        }

        // Weight shift (Vertical bobbing)
        if (bodyRef.current) {
            bodyRef.current.position.y = Math.abs(Math.sin(t * walkSpeed)) * 0.08;
        }

        // Snappier walking motion
        if (lLegRef.current) lLegRef.current.rotation.x = Math.sin(t * walkSpeed) * 0.35;
        if (rLegRef.current) rLegRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * 0.35;

        // Matching Arm swing
        if (lArmRef.current) lArmRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * 0.2 - 0.4;
        if (rArmRef.current) rArmRef.current.rotation.x = Math.sin(t * walkSpeed) * 0.2 - 0.4;
    });

    return (
        <group position={[0, 0, 0]}>
            <group ref={bodyRef}>
                {/* --- HEAD --- */}
                <group ref={headRef} position={[0, 2, 0]}>
                    <mesh castShadow>
                        <boxGeometry args={[1.7, 1.3, 1.2]} />
                        <GlassMaterial color="#4A5678" opacity={0.9} thickness={1} />
                    </mesh>
                    <mesh position={[0, 0, 0.45]} castShadow>
                        <boxGeometry args={[1.3, 0.8, 0.15]} />
                        <meshStandardMaterial color="#111" metalness={0.9} />
                    </mesh>
                    <group position={[0, 0, 0.55]}>
                        <mesh position={[-0.35, 0, 0]}>
                            <planeGeometry args={[0.2, 0.08]} />
                            <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={4} />
                        </mesh>
                        <mesh position={[0.35, 0, 0]}>
                            <planeGeometry args={[0.2, 0.08]} />
                            <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={4} />
                        </mesh>
                    </group>
                </group>

                {/* --- TORSO --- */}
                <mesh castShadow position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.9, 1.1, 2, 32]} />
                    <GlassMaterial color="#FFFFFF" opacity={0.8} transmission={1} />
                </mesh>

                {/* --- PREMIUM SHOULDER ATTACHMENTS --- */}
                <MachinedJoint position={[-0.9, 1.1, 0]} />
                <MachinedJoint position={[0.9, 1.1, 0]} />
                
                {/* --- ARMS --- */}
                <group ref={lArmRef} position={[-1.0, 1.0, 0]}>
                    <mesh castShadow rotation={[0, 0, 0.15]}><capsuleGeometry args={[0.2, 0.8, 4, 16]} /><meshStandardMaterial color="#FFF" /></mesh>
                </group>
                <group ref={rArmRef} position={[1.0, 1.0, 0]}>
                    <mesh castShadow rotation={[0, 0, -0.15]}><capsuleGeometry args={[0.2, 0.8, 4, 16]} /><meshStandardMaterial color="#FFF" /></mesh>
                </group>
            </group>

            {/* --- LEGS --- */}
            <group ref={lLegRef} position={[-0.45, -0.8, 0]}>
                <mesh castShadow position={[0, -0.6, 0]}><capsuleGeometry args={[0.22, 1.2, 4, 16]} /><meshStandardMaterial color="#FFF" /></mesh>
                <mesh position={[0, -1.3, 0.2]} castShadow><boxGeometry args={[0.3, 0.2, 0.5]} /><meshStandardMaterial color="#EEE" /></mesh>
            </group>
            <group ref={rLegRef} position={[0.45, -0.8, 0]}>
                <mesh castShadow position={[0, -0.6, 0]}><capsuleGeometry args={[0.22, 1.2, 4, 16]} /><meshStandardMaterial color="#FFF" /></mesh>
                <mesh position={[0, -1.3, 0.2]} castShadow><boxGeometry args={[0.3, 0.2, 0.5]} /><meshStandardMaterial color="#EEE" /></mesh>
            </group>
        </group>
    );
};

const LabHero3D = () => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            width: '100%', height: '100%', minHeight: isMobile ? '350px' : '550px',
            background: 'transparent', overflow: 'visible', position: 'relative'
        }}>
            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 22 : 18]} fov={isMobile ? 35 : 35} />
                    <Environment preset="studio" />
                    <ambientLight intensity={0.6} />
                    <spotLight position={[15, 15, 15]} intensity={3.5} castShadow />
                    
                    <PresentationControls 
                        global config={{ mass: 2, tension: 500 }} 
                        rotation={[0, 0.3, 0]} 
                        polar={[-0.2, 0.2]} 
                        azimuth={[-0.4, 0.4]}
                    >
                        <group scale={isMobile ? 1.6 : 1.8} position={[0, isMobile ? 0.3 : -0.8, 0]}>
                            <Robot />
                        </group>
                    </PresentationControls>
                    
                    <FloorGrid />
                    <ContactShadows position={[0, -2.1, 0]} opacity={0.4} scale={20} blur={2} far={4} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default LabHero3D;
