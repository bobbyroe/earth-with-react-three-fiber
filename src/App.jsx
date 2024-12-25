import * as THREE from "three";
import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import Nebula from "./Nebula";
import StarField from "./StarField";
import AtmosphereMesh from "./AtmosphereMesh";
import EarthMaterial from "./EarthMaterial";
import ShootingStar from "./ShootingStar";
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
        <icosahedronGeometry args={[radius, 32]} />
        <EarthMaterial />
      </mesh>
      <AtmosphereMesh radius={radius * 1.02} />
    </group>
  );
}

function Satellite() {
  const ref = React.useRef();
  const radius = 2.05;
  let currentTime = 0;
  useFrame((_, delta) => {
    currentTime += delta * 2.0;
    ref.current.position.x = Math.cos(currentTime) * radius;
    ref.current.position.z = Math.sin(currentTime) * radius;
  });
  return (
    <Trail 
      width={0.3} 
      color={0xff9900} 
      length={3} 
      attenuation={(val) => val}
    >
      <mesh ref={ref} position-y={0.15}>
        <sphereGeometry args={[0.02, 4]} />
        <meshBasicMaterial color={0xff9900} />
      </mesh>
    </Trail>
  );
}

function App() {
  const { x, y, z } = sunDirection;
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
      <EarthMesh />
      <ShootingStar />
      <Nebula />
      <StarField />
      <OrbitControls />

      <directionalLight position={[x, y, z]} />
    </Canvas>
  );
}

export default App;
