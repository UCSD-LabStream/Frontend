import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import RaycastModel from './RaycastModel';
import * as THREE from 'three';
import StandardLabel from '../labels/StandardLabel';
import components from '../labels/labels';

function RaycastHandler({ onFaceClick }) {
  const { scene, camera, gl } = useThree();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    // Check if a model (non-light object) exists in the scene
    const checkModelLoaded = () => {
      const hasModel = scene.children.some((child) => !(child instanceof THREE.Light));
      setIsModelLoaded(hasModel);
    };

    checkModelLoaded();

    const observer = new MutationObserver(checkModelLoaded);
    observer.observe(gl.domElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [scene, gl]);

  useEffect(() => {
    if (!isModelLoaded) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      // Fetch the bounds at runtime of handlePointerDown so we get the current size 
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(scene, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        onFaceClick(intersect.faceIndex, intersect.point);
      }
    };

    gl.domElement.addEventListener('pointerdown', handlePointerDown);

    return () => {
      gl.domElement.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [scene, camera, gl, onFaceClick, isModelLoaded]);

  return null;
}

// Helper function to map a point to a component (or no component) and return the relevant label
function getLabelFromCoordinates([x, y, z]) {

  for (const part of components) {
    if (x >= part.minX && x <= part.maxX &&
      y >= part.minY && y <= part.maxY &&
      z >= part.minZ && z <= part.maxZ
    ) {
      // we are in bounds of the part
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

function RaycastWrapper({ setComponent, setDescription, children }) {
  const [labelPosition, setLabelPosition] = useState([0, 0, 0]);
  const [labelActive, setLabelActive] = useState(false);
  const [labelTitle, setLabelTitle] = useState("");
  const [labelDesc, setLabelDesc] = useState("");
  const [orbPosition, setOrbPosition] = useState([0, 0, 0]);

  const orbRef = useRef();

  const handleFaceClick = (faceIndex, point) => {
    console.log(`Clicked face index: ${faceIndex}`);
    console.log('Intersection point:', point);
    // Display label 
    const label = getLabelFromCoordinates([point.x, point.y, point.z]);
    if (label !== "") {
      setLabelActive(true); 
      setComponent(label);
      const comp = components.find(component => component.name === label)
      setDescription(comp.desc)
      setOrbPosition([(comp.maxX - comp.minX) / 2 + comp.minX, comp.maxY + 0.1, (comp.maxZ - comp.minZ) / 2 + comp.minZ])
    }
    console.log(label);
  };
  const toggleLabel = () => {
    setLabelActive(!labelActive);
  }
  const TranslucentBoxComponent = components.find(c => c.name === "Filter slit");

  return (
    <div style={{ display: 'flex', height: '400px', width: '100%' }}>

      <Canvas
        camera={{ position: [10, 6, 10], fov: 30 }}
        style={{ width: '100%', height: '100%' }}
        resize={{ scroll: true, debounce: { scroll: 50, resize: 50 } }} // recalculate size on parent resize
        frameloop="demand"
      >

        {/* Ambient Light to brighten the entire scene */}
        <ambientLight intensity={1} />

        {/* PointLights in two locations to fully illuminate the scene */}
        <pointLight position={[-10, -10, -10]} decay={0} intensity={2} />
        <pointLight position={[10, 10, 10]} decay={0} intensity={2} />
        {/* 
        Example of how to include the translucent box for fine-tuning compnoent bounds*/}
        
        {/* <Box 
        minX={TranslucentBoxComponent.minX}
        maxX={TranslucentBoxComponent.maxX}
        minY={TranslucentBoxComponent.minY}
        maxY={TranslucentBoxComponent.maxY}
        minZ={TranslucentBoxComponent.minZ}
        maxZ={TranslucentBoxComponent.maxZ}
    />  */}
        {labelActive &&
            <mesh position={orbPosition} ref={orbRef}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="red" />
            </mesh>
        }
        {/* Render children components that the wrapper encapsulates (the actual model) */}
        {children}
        <OrbitControls
          enableZoom
          enablePan
          enableRotate />
        <RaycastHandler onFaceClick={handleFaceClick} />
      </Canvas>
    </div>
  );
}

export default RaycastWrapper;
