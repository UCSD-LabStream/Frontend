import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect } from 'react';
import RaycastModel from './RaycastModel';
import * as THREE from 'three';

function RaycastHandler({ onFaceClick }) {
  const { scene, camera } = useThree();

  useEffect(() => {
    const handlePointerDown = (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Convert mouse position to normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
        // get array of collisions between ray and objects 
      const intersects = raycaster.intersectObject(scene, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const faceIndex = intersect.faceIndex; // Index of the intersected face
        const point = intersect.point; // Point of intersection in 3D space

        // Call the callback function with the face index and intersection point
        onFaceClick(faceIndex, point);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [scene, camera, onFaceClick]);

  return null;
}

function Model() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[3, 3, 3]} /> 
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function RaycastWrapper() {
  const handleFaceClick = (faceIndex, point) => {
    console.log(`Clicked face index: ${faceIndex}`);
    console.log('Intersection point:', point);
    // Display label or perform other actions
  };

  return (
    <Canvas
     camera={{ position: [5, 3, 5], fov: 30 }}
     style={{ minHeight: '300px'}}>
      {/* Ambient Light to brighten the entire scene */}
      <ambientLight intensity={0.5} />

      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={3} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={3} />


      <RaycastModel />
      <OrbitControls enableZoom enablePan enableRotate />
      <RaycastHandler onFaceClick={handleFaceClick} />
    </Canvas>
  );
}

export default RaycastWrapper;
