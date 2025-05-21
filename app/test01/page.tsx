"use client"

import React, { useEffect, useState } from 'react'
import { Chibi } from '@/app/chibi.jsx'
import { Canvas, useThree } from '@react-three/fiber'
import { Box, OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function ModelPositioner({ children }: { children: React.ReactNode }) {
    const { size } = useThree();
    const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  
    useEffect(() => {
      // Adjust the position dynamically based on the viewport width
      setPosition([size.width * 0.0085, 0, 0]); // Adjust factor as needed
      console.log("i am changed")
    }, [size]);
  
    return <group position={position}>{children}</group>;
  }

  

function testPage01() {
    return (

        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='bg-amber-100'>testPage01</div>
            <div className='w-full h-96'>
                <Canvas style={{width:"auto", marginBlockEnd:0}} gl={{ preserveDrawingBuffer: true }} shadows dpr={[1, 1.5]} camera={{ zoom: 1, position: [-7.5, 0, 10], rotation: [0, 0, 0] }}>

                    <axesHelper args={[5]} />

                    <ambientLight intensity={1} />
                    <directionalLight position={[0, 10, 0]} intensity={1} castShadow />
                    <directionalLight position={[0, 0, 10]} intensity={1} castShadow />
                    <directionalLight position={[10, 0, 0]} intensity={1} castShadow />
                    <OrbitControls autoRotate/>
                    <Chibi rotation={[0, Math.PI / 3, 0]}></Chibi>

                </Canvas>
            </div>

        </div>

    )
}

export default testPage01