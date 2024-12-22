import * as THREE from "three";
import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Nebula from "./Nebula";
import Starfield from "./Starfield";
import AtmosphereMesh from "./AtmosphereMesh";

function Earth() {
  const ref = React.useRef();
  const map = useLoader(
    THREE.TextureLoader,
    "./world.200412.3x5400x2700.jpg"
  );
  const specMap = useLoader(
    THREE.TextureLoader,
    "./earth-specular-4k.jpg"
  );
  const bumpMap = useLoader(
    THREE.TextureLoader,
    "./gebco_08_rev_elev_21600x10800.jpg"
  );
  // const normalMap = useLoader(
  //   THREE.TextureLoader,
  //   "./8k_earth_normal_map.jpg"
  // );
  useFrame(() => {
    ref.current.rotation.y += 0.001;
  });
  const axialTilt = 23.4 * Math.PI / 180;
  return (
    <group rotation-z={axialTilt}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 64]} />
        <meshStandardMaterial 
        map={map} 
        roughnessMap={specMap}
        // displacementMap={bumpMap}
        // displacementScale={0.2}
        // normalMap={normalMap}
        // normalScale={100}
        />
        <AtmosphereMesh />
      </mesh>
    </group>
  );
}

function App() {
  return (
    <Canvas 
      camera={{ position: [0, 0.1, 5]}}
      gl={{ toneMapping: THREE.NoToneMapping 
    }}>
      <Earth />
      <hemisphereLight args={[0xffffff, 0x000000, 3.0]} />
      <directionalLight position={[1, 1, 1]} intensity={10} />
      <Nebula />
      <Starfield />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
