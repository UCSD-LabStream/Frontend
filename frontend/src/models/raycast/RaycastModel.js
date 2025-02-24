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

const RaycastModel = () => {
    return (
        
        <ModelRender 
            objUrl="/objs/Assembly1.obj"
            mtlUrl="/objs/Assembly1.mtl"
            scale={[10, 10, 10]}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
        />
    );
};
export default RaycastModel;