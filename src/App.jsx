import * as THREE from "three";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import getLayer from "./getLayer";

const bgSprites = getLayer({ 
  numSprites: 8, 
  radius: 10, 
  z: -10.5, 
  size: 24, 
  opacity: 0.2, 
  path: "./rad-grad.png" 
})

function IcoSphere() {
  const icoRef = React.useRef();

  useFrame(() => {
    icoRef.current.rotation.x += 0.01;
    icoRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={icoRef}>
      <icosahedronGeometry />
      <meshStandardMaterial color={0xffff00} />
    </mesh>
  );
}

function App() {
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
      <IcoSphere />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      <primitive object={bgSprites} />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
