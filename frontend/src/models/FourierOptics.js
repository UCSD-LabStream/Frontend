import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls

// STL Model Renderer
function ModelRender({ url, scale, position, rotation, color }) {
    const geom = useLoader(STLLoader, url);
    return (
        <mesh geometry={geom}
            scale={scale}
            position={position}
            rotation={rotation}
        >
            {/* Default to gray if a color is not provided */}
            <meshPhongMaterial color={color || "gray"} />
        </mesh>
    );
}

const FourierOptics = () => {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '300px', // Fill the entire viewport height
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
            }}
        >
            <Canvas
                style={{ minHeight: '300px', backgroundColor: '#FFFFFF' }}
                camera={{ position: [0, 5, 5], fov: 60 }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />
                    <ModelRender url="/ThorLabsSTLs/MB648.stl"
                        scale={[10, 10, 10]}
                        position={[0, -3, 0]}
                        rotation={[Math.PI / 2, 0, 0]}
                    />
                    <ModelRender url="/ThorLabsSTLs/VA100.stl"
                        scale={[10, 10, 10]}
                        position={[0, 0, 0]}
                        rotation={[0, Math.PI / 2, 0]}
                        color="black"
                    />
                </Suspense>
                <OrbitControls
                    enablePan={true}           // Disable panning
                    enableZoom={true}          // Disable zooming
                    enableRotate={true}         // Enable rotation
                    // maxPolarAngle={Math.PI / 2}   // Lock vertical rotation at horizon
                    // minPolarAngle={Math.PI / 2}   // Lock vertical rotation at horizon
                    maxPolarAngle={Infinity}
                    minPolarAngle={-Infinity}
                    enableDamping={true}
                    dampingFactor={0.05}
                    minAzimuthAngle={-Infinity} // Allow full horizontal rotation
                    maxAzimuthAngle={Infinity}  // Allow full horizontal rotation
                />
            </Canvas>
        </div>
    );
};
export default FourierOptics;