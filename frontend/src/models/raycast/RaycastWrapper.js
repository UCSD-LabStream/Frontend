import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useEffect, useState } from 'react';
import RaycastModel from './RaycastModel';
import * as THREE from 'three';
import StandardLabel from '../labels/StandardLabel';
import texts from '../labels/labels';

function RaycastHandler({ onFaceClick }) {
  const { scene, camera } = useThree();
  const { gl } = useThree(); 
  useEffect(() => {
    
    const rect = gl.domElement.getBoundingClientRect();
  
    const handlePointerDown = (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
  
      // Use the rect for correct mouse coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(scene, true);
  
      if (intersects.length > 0) {
        const intersect = intersects[0];
        const faceIndex = intersect.faceIndex;
        const point = intersect.point;
        onFaceClick(faceIndex, point);
      }
    };
  
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [scene, camera, onFaceClick]);
  
}

// Helper function to map a point to a component (or no component) and return the relevant label
function setLabelFromCoordinates([x, y, z]){
  if (y < 0 || y > 2 || z < -0.6 || z > 0.6) {
    console.log("y or z OOB");
    return "";
  }

  for (const part of texts) {
      if (x >= part.minX && x <= part.maxX) {
          return part.name;
      }
  }

  return "";
}

function Box({ minX, maxX, minY, maxY, minZ, maxZ }) {
    // Calculate box size
    const width = maxX - minX;
    const height = maxY - minY;
    const depth = maxZ - minZ;
  
    // Calculate box center position
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;
  
    return (
      <mesh position={[centerX, centerY, centerZ]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="blue" transparent opacity={0.3} wireframe={false} />
      </mesh>
    );
  }  

function RaycastWrapper({ children }) {
  const [labelPosition, setLabelPosition] = useState([0,0,0]);
  var setLabel = false;
  const handleFaceClick = (faceIndex, point) => {
    console.log(`Clicked face index: ${faceIndex}`);
    console.log('Intersection point:', point);
    // Display label 
    const label = setLabelFromCoordinates([point.x, point.y, point.z]);
    console.log(label);
  };

  return (
    <div style={{ display: 'flex', height: '300px', width: '100%' }}>
        
    <Canvas
     camera={{ position: [5, 3, 5], fov: 30 }}
     style={{ width: '100%', height: '100%' }}
     resize={{ scroll: true, debounce: { scroll: 50, resize: 50 } }} // recalculate size on parent resize
   >
   
      {/* Ambient Light to brighten the entire scene */}
      <ambientLight intensity={0.5} />

      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />

    {/* <Box 
        minX={-6.1}
        maxX={-5.44}
        minY={0}
        maxY={2}
        minZ={-0.6}
        maxZ={0.6}

    /> */}
    {/* <Html position={labelPosition} center>
      <StandardLabel 
          title={"test title"}
          description={"label test"}
          showLabel={setLabel}
      />
    </Html> */}
    {/* Render children components that the wrapper encapsulates (the actual model) */}
    {children}
      <OrbitControls enableZoom enablePan enableRotate />
      <RaycastHandler onFaceClick={handleFaceClick} />
    </Canvas>
    </div>
  );
}

export default RaycastWrapper;
