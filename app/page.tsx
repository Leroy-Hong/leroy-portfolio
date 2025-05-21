'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useLayoutEffect, useRef, useEffect } from 'react'
import { Chibi } from './chibi'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import NameIcon from '@/app/nameIcon'
import SubheaderIcon from '@/app/subheaderIcon'


import { Poppins } from 'next/font/google'

const medPoppins = Poppins({
  subsets: ["latin"],
  weight: '500'
})

const heavyPoppins = Poppins({
  subsets: ["latin"],
  weight: '600'
})


function FrameLimiter({ fps = 60 }) {
  const { invalidate, size } = useThree()
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    // Clear any previous interval
    if (intervalRef.current) clearInterval(intervalRef.current)
    // Calculate interval in ms
    const interval = 1000 / fps
    // Set up interval to call invalidate at fixed FPS
    intervalRef.current = window.setInterval(() => {
      invalidate()
    }, interval)

    // Invalidate immediately on resize
    invalidate()

    // Clean up on unmount or fps/size change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fps, size.width, size.height, invalidate])

  return null
}

function LeftOverlay() {
  return (
    <div className={`absolute top-0 left-0 justify-center flex-col`}>
      <NameIcon className='' />
      <div className='relative'>
        <SubheaderIcon className='mt-[-3px]' />
        <div className='ml-9 absolute top-0 left-0'>
          <p className={`${medPoppins.className} text-2xl`}>programmer.</p>
          <p style={{ color: '#57b08d' }} className={`${medPoppins.className} text-2xl`}>designer.</p>
        </div>
      </div>
    </div>
  )
}


function RightOverlay() {
  return (
    <div className='absolute top-0 right-0 mr-9 mt-3 flex flex-col'>
      <div>
        <p className={`${heavyPoppins.className} text-8xl tracking-wide text-center`}>19</p>
        <p className={`${medPoppins.className} w-full mt-[-10px] text-xl self-center text-center`}>years of age</p>
      </div>
      <div className='mt-5'>
        <p className={`${heavyPoppins.className} text-8xl tracking-wide text-center`}>21</p>
        <p className={`${medPoppins.className} w-full mt-[-10px] text-xl self-center text-center`}>distinctions</p>
      </div>
    </div>
  )
}

function MyScene() {
  const coreRef = useRef<THREE.Bone | null>(null);
  const chibiRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const targetRef = useRef<THREE.Mesh | null>(null); // Ref for the target sphere
  const emptyHeadRef = useRef<THREE.Group | null>(null);

  const { camera, pointer } = useThree(); // Pointer contains normalized mouse coordinates
  const lerpFactor = 40; // Smoothness factor for head rotation

  useFrame((state, delta) => {
    // Rotate the entire character (slow spin)
    const deltaLerp = lerpFactor * delta * 0.1;
    if (chibiRef.current) {
      chibiRef.current.rotation.y += 1 * delta;
      chibiRef.current.rotation.y %= Math.PI * 2;


      if (coreRef.current) {
        headRef.current = coreRef.current.children[0]?.children[0]?.children[0]?.children[0];
  
        // Ensure head exists
        if (headRef.current) {

          // Guard clause to enable head rotation only when facing forward
          if (chibiRef.current.rotation.y > Math.PI / 2 && chibiRef.current.rotation.y < 3 * Math.PI / 2) {
            headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, THREE.MathUtils.degToRad(0), deltaLerp * 0.2) % THREE.MathUtils.degToRad(10);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, THREE.MathUtils.degToRad(0), deltaLerp * 0.2) % THREE.MathUtils.degToRad(30);
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, THREE.MathUtils.degToRad(0), deltaLerp * 0.2) % THREE.MathUtils.degToRad(90);
            return
          }

          // Get normalized mouse position and convert it to world space (depth of 4)
          const mousePos = new THREE.Vector3(pointer.x, pointer.y + 1, 0.85).unproject(camera);
          const target = new THREE.Vector3(mousePos.x, mousePos.y, headRef.current.position.z + 2);
  
          // Position the target sphere at the cursor location
          if (targetRef.current) {
            targetRef.current.position.copy(target); // Move the target sphere to the cursor

            if (emptyHeadRef.current) {

              emptyHeadRef.current.lookAt(target); // Look at the target
              // Smoothly rotate the head towards the target
              headRef.current.rotation.z = THREE.MathUtils.lerp(
                headRef.current.rotation.z,
                THREE.MathUtils.clamp(emptyHeadRef.current.rotation.z, THREE.MathUtils.degToRad(-10), THREE.MathUtils.degToRad(10)),
                deltaLerp
              ) % THREE.MathUtils.degToRad(10);
    
              headRef.current.rotation.x = THREE.MathUtils.lerp(
                headRef.current.rotation.x,
                THREE.MathUtils.clamp(emptyHeadRef.current.rotation.x, THREE.MathUtils.degToRad(-30), THREE.MathUtils.degToRad(30)),
                deltaLerp
              ) % THREE.MathUtils.degToRad(30);
    
              headRef.current.rotation.y = THREE.MathUtils.lerp(
                headRef.current.rotation.y,
                THREE.MathUtils.clamp(emptyHeadRef.current.rotation.y, THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(90)),
                deltaLerp
              ) % THREE.MathUtils.degToRad(90);
            }
          }
        }
      }

    }

    
  });

  return (
    <>
      <FrameLimiter fps={30} />
      <Environment preset="forest" />
      <ambientLight intensity={0.8} />
      <group rotation={[0, 0, Math.PI/8]}>
        <group ref={chibiRef}>
          <Chibi rotation={[0, Math.PI / 2, 0]} coreRef={coreRef} />
          <group ref={emptyHeadRef} position={headRef.current?.position} />
        </group>

        <mesh ref={targetRef}>
          {/* <sphereGeometry args={[0.1, 16, 16]} /> */}
          {/* <meshBasicMaterial color="red" /> */}
        </mesh>
      </group>
    </>
  );
}


function TestPage03() {
  return (
    <>
    <div className='flex justify-center flex-col h-[100vh] w-full' style={{ backgroundImage: 'url(images/ai_upscaled_marble_bg.jpg)', backgroundSize: 'cover' }}>
      <RightOverlay />
      <LeftOverlay />
      <div className='w-[100vw] h-[100vh] items-center justify-center self-center block'>
        <Canvas frameloop='demand' camera={{ position: [0, -1, 10], rotation: [0, 0, 0] }} dpr={0.9}>
          <MyScene />
        </Canvas>
      </div>
    </div>

    <p className='text-center'>This site is a work in progress. Until I finish studying for school, I guess this is all I can show...
      <br />Find my old portfolio here: <a href='https://sites.google.com/view/leroyhongprofile33/achievements-and-projects'>https://sites.google.com/view/leroyhongprofile33/achievements-and-projects</a>
    </p>


    </>
    
  )
}

export default TestPage03