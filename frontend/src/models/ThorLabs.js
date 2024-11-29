import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls

function ModelRender({ url }) {
    const geom = useLoader(STLLoader, url);
    return (
        <mesh geometry={geom}
            scale={[15,15,15]}
            position={[0,0,0]}
        >
            <meshPhongMaterial color="gray" />
        </mesh>
    );
}

const ThorLabs = () => {
    return (
        <Canvas
            style={{ height: '100%' }} 
            camera={{ position: [2, 2, 0], fov: 40 }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />
                <ModelRender url="/ThorLabsSTLs/TR2-Solidworks.stl" />
            </Suspense>
            <OrbitControls
                enablePan={false}           // Disable panning
                enableZoom={false}          // Disable zooming
                enableRotate={true}         // Enable rotation
                maxPolarAngle={Math.PI/2}   // Lock vertical rotation at horizon
                minPolarAngle={Math.PI/2}   // Lock vertical rotation at horizon
                enableDamping={true}
                dampingFactor={0.05}
                minAzimuthAngle={-Infinity} // Allow full horizontal rotation
                maxAzimuthAngle={Infinity}  // Allow full horizontal rotation
            />
        </Canvas>
    );
};
export default ThorLabs;