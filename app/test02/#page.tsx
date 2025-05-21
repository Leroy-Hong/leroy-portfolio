'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Chibi } from '../chibi'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

import { Inter } from 'next/font/google'
 
const inter = Inter({
  subsets: ['latin'],
})

function FrameLimiter({ fps = 60 }) {
    const { advance, set, frameloop: initFrameloop } = useThree()
    useLayoutEffect(() => {
      let elapsed = 0
      let then = 0
      let raf = null
      const interval = 1000 / fps
      function tick(t) {
        raf = requestAnimationFrame(tick)
        elapsed = t - then
        if (elapsed > interval) {
          advance(t)
          then = t - (elapsed % interval)
        }
      }
      // Set frameloop to never, it will shut down the default render loop
      set({ frameloop: 'never' })
      // Kick off custom render loop
      raf = requestAnimationFrame(tick)
      // Restore initial setting
      return () => {
        cancelAnimationFrame(raf)
        set({ frameloop: initFrameloop })
      }
    }, [fps])
  }



function RotatingGroup({ children }: { children: React.ReactNode }) {
    let [rotation, setRotation] = useState([0, 0, 0])
    useFrame((_, delta) => {
        setRotation([0, rotation[1] + 0.0025 * delta, 0])
    })
  
    return <group rotation={rotation}>{children}</group>;
  }

function testPage02() {

    const chibiRef = useRef(null)

    

    return (
        <div className='flex justify-center flex-col'>
            <div className='w-96 h-96 items-center justify-center self-center block'>
                <Canvas camera={{ position: [0, 0, 10], rotation: [0, 0, 0] }} dpr={0.9}>
                    <FrameLimiter fps={10} />
                    {/* <axesHelper args={[5]} /> */}

                    <Environment preset="forest"/>

                    <ambientLight intensity={0.8} />
                    {/* <directionalLight position={[0, 10, 3]} intensity={1} castShadow /> */}
                    {/* <directionalLight position={[0, 0, 10]} intensity={1} castShadow /> */}
                    {/* <directionalLight position={[10, 0, 0]} intensity={1} castShadow /> */}
                    {/* <OrbitControls autoRotate /> */}

                    <RotatingGroup>
                        <Chibi />
                        <mesh position={[0, -7.4, 0]}>
                          <boxGeometry args={[4,1,4]}/>
                          <meshBasicMaterial color='white'/>
                        </mesh>
                    </RotatingGroup>                    
                </Canvas>
            </div>
            <p className={inter.className + " font-normal self-center text-xl"}>Hey! I'm</p>

            <p className={inter.className + " font-extrabold self-center text-4xl"}>Leroy Hong</p>

        </div>


    )
}

export default testPage02