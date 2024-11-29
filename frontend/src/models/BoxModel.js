import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls

// Box component as a functional component
const Box = (props) => {
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    // Rotate the mesh every frame
    useFrame((state, delta) => {
        ref.current.rotation.x += delta;
    });

    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={() => setClicked(!clicked)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[3, 3, 3]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
};

// Main BoxModel functional component
const BoxModel = () => {
    return (
        <Canvas
            style={{ height: '100%' }} // Fullscreen Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
        >
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />

            {/* Render two boxes */}
            <Box position={[-2, 0, 0]} />
            <Box position={[2, 0, 0]} />

            <OrbitControls enablePan={true} enableZoom={true} />
        </Canvas>
    );
};
export default BoxModel;