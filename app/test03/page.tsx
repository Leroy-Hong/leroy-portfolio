'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Chibi } from '../chibi'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import NameIcon from '@/app/nameIcon'
import SubheaderIcon from '@/app/subheaderIcon'


import { Inter, League_Spartan, Poppins } from 'next/font/google'

const medPoppins = Poppins({
  subsets: ["latin"],
  weight: '500'
})

const heavyPoppins = Poppins({
  subsets: ["latin"],
  weight: '600'
})


function FrameLimiter({ fps = 60 }) {
  const { advance, set, size, viewport } = useThree()
  useLayoutEffect(() => {
    let elapsed = 0
    let then = 0
    let raf: number = 0
    const interval = 1000 / fps

    function tick(t: number) {
      raf = requestAnimationFrame(tick)
      elapsed = t - then
      if (elapsed > interval) {
        advance(t)
        then = t - (elapsed % interval)
      }
    }

    function onResize() {
      advance(performance.now()) // Force update on resize
    }

    // Set frameloop to never, it will shut down the default render loop
    set({ frameloop: 'never' })
    // Kick off custom render loop
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)

    // Restore initial setting
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      set({ frameloop: 'always' }) // Restore normal rendering on unmount
    }
  }, [fps, size, viewport]) // Include size and viewport in dependencies

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

// function MarblePlane() {
//   return (
//     <mesh scale={[1, 1, 1]}>
//       <planeGeometry args={[10, 10]} />
//       <shaderMaterial
//         uniforms={MarbleShader.uniforms}
//         vertexShader={MarbleShader.vertexShader}
//         fragmentShader={MarbleShader.fragmentShader}
        
//       />
//     </mesh>
//   )
// }

function MyScene() {
  const coreRef = useRef<THREE.Group | null>(null);
  const chibiRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const targetRef = useRef<THREE.Mesh | null>(null); // Ref for the target sphere
  const emptyHeadRef = useRef<THREE.Group | null>(null);

  const { camera, pointer } = useThree(); // Pointer contains normalized mouse coordinates
  const lerpFactor = 0.05; // Smoothness factor for head rotation

  useFrame((state, delta) => {
    // Rotate the entire character (slow spin)
    const deltaLerp = lerpFactor * delta * 0.1;
    if (chibiRef.current) {
      chibiRef.current.rotation.y += 0.001 * delta;
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
    <div className='flex justify-center flex-col h-[100vh] w-full' style={{ backgroundImage: 'url(images/ai_upscaled_marble_bg.jpg)', backgroundSize: 'cover' }}>
      <RightOverlay />
      <LeftOverlay />
      <div className='w-[100vw] h-[100vh] items-center justify-center self-center block'>
        <Canvas camera={{ position: [0, -1, 10], rotation: [0, 0, 0] }} dpr={0.9}>
          <MyScene />
        </Canvas>
      </div>
    </div>
  )
}

export default TestPage03