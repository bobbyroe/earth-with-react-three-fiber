import * as THREE from "three";
import React from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";

function ShootingStar() {
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

export default ShootingStar;