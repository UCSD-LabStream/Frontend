// Aiming to put multiple STL models on one page in a joint model

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import StandardLabel from './labels/StandardLabel';
import SliderLabel from './labels/SliderLabel';
import './modelStyles.scss'

function ModelRender({ url, position, label, labelPosition }) {
    const geom = useLoader(STLLoader, url);
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
        useEffect(() => {
            if (!clicked) return;
    
            const handleClickOutside = (event) => {
                setClicked(false);
            };
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }, [clicked]);

    return (
        <>
            {/* The 3D object */}
            <mesh geometry={geom}
                scale={[15, 15, 15]}
                position={position}
                onClick={(e) => {
                    e.stopPropagation();  
                    setClicked(!clicked);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <meshPhongMaterial
                    color={hovered ? "cyan" : "gray"}
                />
            </mesh>

            {/* The Label for this object */}
            {clicked && (
                <Html position={labelPosition} center>
                    <StandardLabel 
                        title={label}
                        showLabel={setClicked}
                    />
                </Html>
            )}
        </>
    );
}

function BoxRender({ position, label, labelPosition }) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (!clicked) return;
    
        const handleClickOutside = (event) => {
            const targetElement = document.getElementById("slider-label");
            if (targetElement && !targetElement.contains(event.target)) {
                setClicked(false);
            }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [clicked]);    

    return (
        <>
            <mesh
                position={position}
                onClick={(e) => {
                    e.stopPropagation();
                    setClicked(!clicked);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={hovered ? "cyan" : "orange"} />
            </mesh>
            {clicked && (
                <Html position={labelPosition} center>
                    <SliderLabel 
                        title={label}
                        showLabel={setClicked}
                    />
                </Html>
            )}
        </>
    );
}


const MultiModel = () => {
    return (
        <Canvas
            style={{ height: '300px' }}
            // Camera position (IMPORTANT)
            camera={{ position: [1, 2, 3], fov: 50 }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
                <spotLight position={[1, 1, 5]} angle={0.3} penumbra={1} decay={0} intensity={3} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />
                <ModelRender url="/ThorLabsSTLs/TR2-Solidworks.stl" position={[1, -1, 0]} label="part 2" labelPosition={[1, 0, 0]} />
                <ModelRender url="/ThorLabsSTLs/TR2-Solidworks.stl" position={[-1, -1, 0]} label="part 1" labelPosition={[-1, 0, 0]} />
                <BoxRender position={[0, -1, 0]} label="Adjustable box" labelPosition={[0, 0.5, 0]} />
            </Suspense>
            <OrbitControls
                enablePan={false}           // Disable panning
                enableZoom={false}          // Disable zooming
                enableRotate={true}         // Enable rotation
                maxPolarAngle={Math.PI / 3}   // Lock vertical rotation at pi/3
                minPolarAngle={Math.PI / 3}   // Lock vertical rotation at pi/3
                enableDamping={true}
                dampingFactor={0.05}
                minAzimuthAngle={-Infinity} // Allow full horizontal rotation
                maxAzimuthAngle={Infinity}  // Allow full horizontal rotation
            />
        </Canvas>
    );
};
export default MultiModel;