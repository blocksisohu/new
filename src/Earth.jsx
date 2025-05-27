import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import spaceTexture from './assets/space.jpg'; // الصورة لازم تكون موجودة فعلاً

export default function Earth() {
  const earthRef = useRef();
  const spaceRef = useRef();

  const spaceMap = useLoader(THREE.TextureLoader, spaceTexture);

  useFrame(({ mouse }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.003;
    }

    if (spaceRef.current) {
      spaceRef.current.rotation.y = mouse.x * 0.2;
      spaceRef.current.rotation.x = mouse.y * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* خلفية فضائية باستخدام Sphere ضخمة من الداخل */}
      <mesh ref={spaceRef}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={spaceMap} side={THREE.BackSide} />
      </mesh>

      {/* الكرة الأرضية */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </>
  );
}
