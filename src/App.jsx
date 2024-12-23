import * as THREE from "three";
import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Nebula from "./Nebula";
import StarField from "./StarField";
import AtmosphereMesh from "./AtmosphereMesh";
import EarthMaterial from "./EarthMaterial";
const sunDirection = new THREE.Vector3(-2, 0.5, 1.5);
function EarthMesh() {

  const ref = React.useRef();
  const map = useLoader(THREE.TextureLoader, "./textures/earth-daymap-4k.jpg");
  useFrame(() => {
    ref.current.rotation.y += 0.002;
  });
  const radius = 1.5;
  return (
    <group rotation-z={THREE.MathUtils.degToRad(-23.5)}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[radius, 32]}/>
        <EarthMaterial/>
      </mesh>
      <AtmosphereMesh radius={radius * 1.02}/>
    </group>
  );
}

function App() {
  const { x, y, z } = sunDirection;
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
      <EarthMesh />
      <Nebula />
      <StarField />
      <OrbitControls />
      <directionalLight position={[x, y, z]} />
    </Canvas>
  );
}

export default App;
