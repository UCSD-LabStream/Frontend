import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei'; // Import OrbitControls

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(0)} % loaded</Html>;
}


function GLTF() {
    const { scene } = useGLTF('/models/model.glb');

    return (
        <>
            {/* The model */}
            <group rotation={[0, 0, 0]} scale={0.01}>
                <primitive object={scene} />
            </group>
        </>
    );
}

const RaycastModel = () => {
    return (
        <>
            <Suspense fallback={<Loader />}>
            <GLTF />
            </Suspense>
        </>
    );
};
export default RaycastModel;