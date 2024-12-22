import * as THREE from "three";
import React from "react";
import { useLoader } from "@react-three/fiber";

const defaultSunDirection = new THREE.Vector3(-2, 0.5, 1.5).normalize();

function getEarthMat(sunDirection = defaultSunDirection) {
  const map = useLoader(
    THREE.TextureLoader, 
    "./textures/earth-daymap-4k.jpg"
);
  const nightMap = useLoader(
    THREE.TextureLoader,
    "./textures/earth-nightmap-4k.jpg"
  );
  const bumpMap = useLoader(
    THREE.TextureLoader,
    "./textures/earth-bump-4k.jpg"
  );
//   const roughnessMap = useLoader(
//     THREE.TextureLoader,
//     "./textures/earth-specular-4k.jpg"
//   );
  const cloudsMap = useLoader(
    THREE.TextureLoader,
    "./textures/earth-clouds-4k.jpg"
  );
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const uniforms = {
    dayTexture: { value: map },
    elevTexture: { value: bumpMap },
    nightTexture: { value: nightMap },
    cloudsTexture: { value: cloudsMap },
    sunDirection: { value: sunDirection },
  };

//   const vertexShader = `
//   uniform float size;
//   uniform sampler2D elevTexture;

//   varying vec2 vUv;
//   varying float vVisible;

//   void main() {
//     vUv = uv;
//     vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//     float elv = texture2D(elevTexture, vUv).r;
//     vec3 vNormal = normalMatrix * normal;
//     vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
//     mvPosition.z += 0.35 * elv;
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

  const vs = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform sampler2D elevTexture;

    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float elv = texture2D(elevTexture, vUv).r;
      mvPosition.z += elv * 0.15;
      gl_Position = projectionMatrix * mvPosition;

      // Model normal
      vec3 modelNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;

      // Varyings
      vUv = uv;
      vNormal = modelNormal;
      vPosition = mvPosition.xyz;
    }
  `;

  const fs = `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D cloudsTexture;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDirection = normalize(vPosition - cameraPosition);
      vec3 normal = normalize(vNormal);
      vec3 color = vec3(0.0);

      // Sun orientation
      float sunOrientation = dot(sunDirection, normal);

      // Day / night color
      float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);
      vec3 dayColor = texture(dayTexture, vUv).rgb;
      vec3 nightColor = texture(nightTexture, vUv).rgb;
      color = mix(nightColor, dayColor, dayMix);

      // Specular cloud color
      vec2 specularCloudsColor = texture(cloudsTexture, vUv).rg;

      // Clouds
      float cloudsMix = smoothstep(0.0, 1.0, specularCloudsColor.g);
      cloudsMix *= dayMix;
      color = mix(color, vec3(1.0), cloudsMix);

      // Specular
      vec3 reflection = reflect(- sunDirection, normal);
      float specular = - dot(reflection, viewDirection);
      // specular = max(specular, 0.0);
      // specular = pow(specular, 0.5);
      // specular *= specularCloudsColor.r;
      // color += specular * 0.5;
      
      // Final color
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
  });
  return material;
}

function EarthMaterial({ sunDirection }) {
  const material = React.useMemo(() => getEarthMat(sunDirection), []);
  return <primitive object={material} />;
}

export default EarthMaterial;
