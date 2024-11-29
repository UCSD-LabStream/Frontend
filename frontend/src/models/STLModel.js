import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls

function ModelRender({ url }) {
    const geom = useLoader(STLLoader, url);
    return (
        <mesh geometry={geom}>
            <meshPhongMaterial color="orange" />
        </mesh>
    );
}

// Main STLModel functional component
const STLModel = () => {
    console.log("rendering STL model.");
    return (
        <Canvas
            style={{ height: '100%' }} // Fullscreen Canvas
            camera={{ position: [100, 100, 100], fov: 50 }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />
                <ModelRender url="/3DBenchy.stl" />
            </Suspense>
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI} // Allow full vertical rotation
                minPolarAngle={0} // Allow full vertical rotation
                enableDamping={true}
                dampingFactor={0.25}
            />
        </Canvas>
    );
};
export default STLModel;