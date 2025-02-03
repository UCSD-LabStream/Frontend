import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls

// OBJ Model Renderer
function ModelRender({ objUrl, mtlUrl, scale, position, rotation }) {
    const materials = useLoader(MTLLoader, mtlUrl);
    const geom = useLoader(OBJLoader, objUrl, (loader) => {
        if (materials) {
            materials.preload();
            loader.setMaterials(materials);
        }
    });

    const checkFileExistence = async (filePaths) => {
        const results = await Promise.all(
            filePaths.map((path) =>
                fetch(path, { method: 'HEAD' })
                    .then((res) => res.ok)
                    .catch(() => false)
            )
        );
        return results.every(Boolean);
    };
    
    return (
        <primitive
            object={geom}
            scale={scale}
            position={position}
            rotation={rotation}
        />
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
                camera={{ position: [0, 2, 6], fov: 60 }}
                frameloop="demand"
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />
                    <ModelRender 
                        objUrl="/full-assembly/Assembly-1.obj"
                        mtlUrl="/full-assembly/Assembly-1.mtl"
                        scale={[10, 10, 10]}
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                    />
                </Suspense>
                <OrbitControls
                    enablePan={false}           // Disable panning
                    enableZoom={false}          // Disable zooming
                    enableRotate={true}         // Enable rotation
                    maxPolarAngle={Math.PI / 3}   // Lock vertical rotation at horizon
                    minPolarAngle={Math.PI / 3}   // Lock vertical rotation at horizon
                    // maxPolarAngle={Infinity}
                    // minPolarAngle={-Infinity}
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