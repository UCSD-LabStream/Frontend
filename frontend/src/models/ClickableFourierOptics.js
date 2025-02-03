import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import StandardLabel from './labels/StandardLabel';
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei'; // Import OrbitControls
import texts from './labels/labels'

// OBJ Model Renderer
function ModelRender({ objUrl, mtlUrl, scale, position, rotation, clickable, labelTitle, labelBody, labelPosition }) {
    const materials = useLoader(MTLLoader, mtlUrl);
    const geom = useLoader(OBJLoader, objUrl, (loader) => {
        if (materials) {
            materials.preload();
            loader.setMaterials(materials);
        }
    });

    // Deep clone geometry and materials
    const clonedGeom = React.useMemo(() => {
        if (!geom) return null;
        const clone = geom.clone();
        clone.traverse((child) => {
            if (child.isMesh && child.material) {
                // Clone each material to avoid sharing between instances
                child.material = child.material.clone();
            }
        });
        return clone;
    }, [geom]);

    const [isHovered, setIsHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const modelRef = useRef();
    const originalMaterials = useRef(new Map());

    // Capture materials after model is loaded
    useEffect(() => {
        if (modelRef.current) {
            originalMaterials.current.clear();
            modelRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    // Store cloned material (already cloned in clonedGeom)
                    originalMaterials.current.set(child, child.material.clone());
                }
            });
        }
    }, [clonedGeom]); // Run when clonedGeom updates

    const handlePointerOver = () => {
        if (clickable) {
            setIsHovered(true);
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    const newMaterial = originalMaterials.current.get(child).clone();
                    newMaterial.color.set('cyan');
                    child.material = newMaterial;
                }
            });
        }
    };

    const handlePointerOut = () => {
        if (clickable) {
            setIsHovered(false);
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material = originalMaterials.current.get(child).clone();
                }
            });
        }
    };

    const handleClick = (e) => {
        if (clickable) {
            e.stopPropagation();
            setClicked(!clicked);
        }
    };

    return (
        <>
            <primitive
                ref={modelRef}
                object={clonedGeom} // Use the cloned object here
                scale={scale}
                position={position}
                rotation={rotation}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerMissed={handlePointerOut}
                onClick={handleClick}
            />
            
            {/* Label */}
            {clicked && labelTitle && (
                <Html position={labelPosition} center>
                    <StandardLabel 
                        title={labelTitle}
                        description={labelBody}
                        showLabel={setClicked}
                    />
                </Html>
            )}
        </>
    );
}

const ClickableFourierOptics = ({background}) => {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '300px', // Fill the entire viewport height
                overflow: 'hidden',
            }}
        >
            <Canvas
                style={{ minHeight: '300px', backgroundColor: background === 'white' ? '#FFFFFF' : 'transparent' }}
                camera={{ position: [0, 2, 6], fov: 45 }}
                frameloop="demand"
                dpr={[1, 2]} 
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
                    <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />
                    <ModelRender 
                        objUrl="/objs/Assembly1.obj"
                        mtlUrl="/objs/Assembly1.mtl"
                        scale={[10, 10, 10]}
                        position={[0, 0, 0]}
                        rotation={[Math.PI, 0, 0]}
                    />
                    <ModelRender 
                        objUrl="/objs/camera/camera.obj"
                        mtlUrl="/objs/camera/camera.mtl"
                        scale={[10, 10, 10]}
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        clickable={true}
                        labelTitle={"Camera"}
                        labelBody={texts.Camera}
                        labelPosition={[6,0,0]}
                    />
                    <ModelRender 
                        objUrl="/objs/Beamsplitter/Beamsplitter.obj"
                        mtlUrl="/objs/Beamsplitter/Beamsplitter.mtl"
                        scale={[10, 10, 10]}
                        position={[-0.95, -0.2, -0.27]}
                        rotation={[Math.PI/2, 0, 0]}
                        clickable={true}
                        labelTitle={"Beamsplitter"}
                        labelBody={texts.Beamsplitter}
                        labelPosition={[3,0,0]}
                    />
                    <ModelRender 
                        objUrl="/objs/LED/LED.obj"
                        mtlUrl="/objs/LED/LED.mtl"
                        scale={[10, 10, 10]}
                        position={[-0.34, 1.5, -1.14]}
                        rotation={[Math.PI, 0, 0]}
                        clickable={true}
                        labelTitle={"LED"}
                        labelBody={texts.LED}
                        labelPosition={[-6,0,0]}
                    />
                    <ModelRender 
                        objUrl="/objs/FieldIris/FieldIris.obj"
                        mtlUrl="/objs/FieldIris/FieldIris.mtl"
                        scale={[10, 10, 10]}
                        position={[-1.33, -0.4, 2.205]}
                        rotation={[-Math.PI/2, 0, -Math.PI/2]}
                        clickable={true}
                        labelTitle={"Field Iris"}
                        labelBody={texts['Field Iris']}
                        labelPosition={[-1.5,0,0]}
                    />
                    <ModelRender 
                        objUrl="/objs/ApertureIris/ApertureIris.obj"
                        mtlUrl="/objs/ApertureIris/ApertureIris.mtl"
                        scale={[10, 10, 10]}
                        position={[2.18, 2.8, 2.18]}
                        rotation={[-Math.PI/2, 0, -Math.PI/2]}
                        clickable={true}
                        labelTitle={"Aperture Iris"}
                        labelBody={texts['Aperture Iris']}
                        labelPosition={[1.5,0,0]}
                    />
                    <ModelRender 
                    objUrl="/objs/FieldLens/FieldLens.obj"
                    mtlUrl="/objs/FieldLens/FieldLens.mtl"
                    scale={[10, 10, 10]}
                    position={[-1.75, -0.65, -0.33]}
                    rotation={[-Math.PI/2, 0, -Math.PI/2]}
                    clickable={true}
                    labelTitle={"Field Lens"}
                    labelBody={texts['Field Lens']}
                    labelPosition={[-1,0,0]}
                    />
                    <ModelRender 
                    objUrl="/objs/FieldLens/FieldLens.obj"
                    mtlUrl="/objs/FieldLens/FieldLens.mtl"
                    scale={[10, 10, 10]}
                    position={[3.1, -0.58, -0.28]}
                    rotation={[-Math.PI/2, 0, -Math.PI/2]}
                    clickable={true}
                    labelTitle={"Tube Lens"}
                    labelBody={texts['Tube Lens']}
                    labelPosition={[3.5,0,0]}
                    />
                    <ModelRender 
                    objUrl="/objs/Target/Target.obj"
                    mtlUrl="/objs/Target/Target.mtl"
                    scale={[10, 10, 10]}
                    position={[0, 0, 0]}
                    rotation={[-Math.PI/2, 0, 0]}
                    clickable={true}
                    labelTitle={"Target"}
                    labelBody={texts['Target']}
                    labelPosition={[2,0,0]}
                    />
                </Suspense>
                <OrbitControls
                    enablePan={true} 
                    enableZoom={true} 
                    enableRotate={true} 
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
export default ClickableFourierOptics;