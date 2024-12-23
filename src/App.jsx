import * as THREE from "three";
import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
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
        <icosahedronGeometry args={[radius, 32]} />
        <EarthMaterial />
      </mesh>
      <AtmosphereMesh radius={radius * 1.02} />
    </group>
  );
}

function Comet() {
  const ref = React.useRef();
  const startPos = new THREE.Vector3(-10, 10, -10);
  const targetPos = new THREE.Vector3(7, 5, -7);
  const curPos = new THREE.Vector3().copy(startPos);
  let elapsedTime = -1;
  useFrame((_, delta) => {
    const { position } = ref.current;
    elapsedTime += delta;
    curPos.lerpVectors(startPos, targetPos, elapsedTime);
    position.copy(curPos);
    if (elapsedTime >= 10) {
      position.set(20, 20,-10);
      elapsedTime = -1;
    }
  });
  return (
    <Trail
      width={0.5}
      color={0xffffff}
      length={1}
      attenuation={(width) => width * Math.random()}
    >
      <mesh ref={ref} position={startPos}>
        <sphereGeometry args={[0.03, 32]}/>
        <meshBasicMaterial />
      </mesh>
    </Trail>
  );
}
function App() {
  const { x, y, z } = sunDirection;
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
      <EarthMesh />
      <Nebula />
      <StarField />
      <Comet />
      <OrbitControls />
      <directionalLight position={[x, y, z]} />
    </Canvas>
  );
}

export default App;
