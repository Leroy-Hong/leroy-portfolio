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

// GSAP import
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

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
      <NameIcon className='max-h-[28vh] w-[60vw] h-auto block' preserveAspectRatio="xMinYMin meet" />
      <div className='relative'>
        <SubheaderIcon  className='mt-[-3px] max-h-[8vh] w-[20vw] h-auto block' preserveAspectRatio="xMinYMin meet"/>
        <div className='absolute top-0 left-0' style={{ fontSize: "clamp(0.8rem, 0.32 * 10vw, 1.8rem)", marginLeft: "clamp(0px, 4vw, 2.25rem)" }}>
          <p className={`${medPoppins.className}`}>programmer.</p>
          <p style={{ color: '#57b08d' }} className={`${medPoppins.className}`}>designer.</p>
        </div>
      </div>
    </div>
  )
}

function RightOverlay() {
  return (
    <div className='absolute top-0 right-0 mr-9 mt-3 flex flex-col'>
      <div>
        <p className={`${heavyPoppins.className} leading-none tracking-wide text-center`} style={{ fontSize: "clamp(0.8em, 1.2 * 10vw, 6rem)"}} >19</p>
        <p className={`${medPoppins.className} leading-none w-full self-center text-center`} style={{ fontSize: "clamp(0rem, 0.2 * 10vw, 1.25rem)"}}>years of age</p>
      </div>
      <div className='mt-5'>
        <p className={`${heavyPoppins.className} leading-none tracking-wide text-center`} style={{ fontSize: "clamp(0.8em, 1.2 * 10vw, 6rem)"}}>21</p>
        <p className={`${medPoppins.className} leading-none w-full self-center text-center`} style={{ fontSize: "clamp(0rem, 0.2* 10vw, 1.25rem)"}}>distinctions</p>
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

// About Me Section Component
function AboutSection() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto px-4 py-16 md:py-24 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl border border-white border-opacity-20 shadow-2xl">
        <h2 className={`${heavyPoppins.className} text-3xl md:text-4xl mb-8 text-center`} style={{ color: '#57b08d' }}>
          About Me
        </h2>
        
        <div className={`${medPoppins.className} text-lg md:text-xl leading-relaxed space-y-6`}>
          <p>
             Hello! I'm Leroy, a <b>web developer</b> who believes that the best software is a thoughtful mix of great design and clean code.
             I’ve been programming for almost half my life, and my projects reflect my commitment to creating intuitive and powerful user-centric applications.
             Explore my work to see what I'm currently building!
          </p>
          
          <p>
            My work spans across various domains including web development, 3D modeling, and interactive design. 
            I believe in the power of technology to solve real-world problems and create meaningful connections 
            between people and digital interfaces.
          </p>
        
        </div>
        
        <div className="mt-10 text-center">
          <a 
            href="https://sites.google.com/view/leroyhongprofile33/achievements-and-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl inline-block px-20 py-4 bg-opacity-20 hover:bg-opacity-30 transition-all duration-500 rounded-xl backdrop-blur-sm border border-white border-opacity-30 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ backgroundColor: '#57b08d' }}
          >
            <b style={{ color: 'white' }}>My Works</b>
          </a>
        </div>
      </div>
    </div>
  );
}

function TestPage03() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const aboutContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sceneContainerRef.current || !aboutContainerRef.current || !triggerRef.current) return;

    // Set initial states
    gsap.set(sceneContainerRef.current, { 
      opacity: 1, 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 10 
    });
    
    // Position the About Me container as fixed but hidden initially
    gsap.set(aboutContainerRef.current, { 
      opacity: 0, 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 5,
      overflowY: 'auto' // Allow scrolling within the About section if content is long
    });

    // Create a timeline for the animation
    const tl = gsap.timeline({ paused: true });

    // Add animations to the timeline
    tl.to(sceneContainerRef.current, { 
      opacity: 0, 
      zIndex: 5, // Lower z-index when fading out
      duration: 1,
      ease: "power2.inOut"
    })
    .to(aboutContainerRef.current, { 
      opacity: 1, 
      zIndex: 15, // Higher z-index when fading in
      duration: 1,
      ease: "power2.out"
    }, "-=0.5"); // Start this animation 1 second before the previous one ends

    // Create scroll trigger that plays the timeline when a specific point is crossed
    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top 85%", // Trigger when top of trigger element is 85% down the viewport
      onEnter: () => {
        console.log("Trigger activated - playing timeline");
        tl.play();
      },
      onLeaveBack: () => {
        console.log("Reverse trigger activated - reversing timeline");
        tl.reverse();
      }
    });

  }, []);

  return (
    <div className="relative">
      {/* Fixed 3D Scene Container */}
      <div ref={sceneContainerRef} style={{ backgroundImage: 'url(images/ai_upscaled_marble_bg.jpg)', backgroundSize: 'cover' }}>
        <RightOverlay />
        <LeftOverlay />
        <div className='w-[100vw] h-[100vh] items-center justify-center self-center block'>
          <Canvas frameloop='demand' camera={{ position: [0.8, -1, 10], rotation: [0, 0, 0] }} dpr={0.9}>
            <MyScene />
          </Canvas>
        </div>
      </div>
      
      {/* Scrollable content area with trigger element */}
      <div className="relative" style={{ marginTop: '100vh' }}>
        {/* Trigger element - positioned where we want the animation to start */}
        <div ref={triggerRef} className="absolute top-0 left-0 w-full h-1"></div>
        
        {/* Minimal spacer to create scrollable space */}
        <div className="h-screen"></div>
      </div>
      
      {/* About Section Container - initially hidden and fixed */}
      <div ref={aboutContainerRef} style={{ backgroundImage: 'url(images/ai_upscaled_marble_bg.jpg)', backgroundSize: 'cover' }}>
        <AboutSection />
      </div>
    </div>
  )
}

export default TestPage03