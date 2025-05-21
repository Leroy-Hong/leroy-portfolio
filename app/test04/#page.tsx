'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Chibi } from '../chibi'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import NameIcon from '../nameIcon'
import SubheaderIcon from '../subheaderIcon'


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

function RotatingGroup({ children }: { children: React.ReactNode }) {
  let [rotation, setRotation] = useState([0, 0, 0])
  useFrame((_, delta) => {
    setRotation([0, rotation[1] + 0.001 * delta, 0])
  })

  return <group rotation={rotation}>{children}</group>;
}


function MyScene() {
  const coreRef = useRef(null)
  const chibiRef = useRef(null)
  let head = null;

  const { camera, pointer } = useThree() // Pointer contains normalized mouse coordinates

  useFrame((state, delta) => {
    // chibiRef.current.rotation.y = 0
    chibiRef.current.rotation.y += 0.001
    chibiRef.current.rotation.y %= Math.PI * 2

    if (coreRef.current) {
      head = coreRef.current.children[0].children[0].children[0].children[0]
        // Convert pointer position to world space

      // console.log(head.rotation)
      head.rotation.x = 0
      let trueYRot = Math.PI - Math.atan2(0.95, pointer.x)
      let trueXRot = Math.PI - Math.atan2(pointer.y, 0.95)


      
      let relYRot = trueYRot - chibiRef.current.rotation.y
      let relXRot = trueXRot - chibiRef.current.rotation.x

      // head.rotation.y = relativeHeadRotation

      if (relYRot < Math.PI / 2 && relYRot > 0) {
        console.log('less than -pi/2')
        // head.rotation.y = relativeHeadRotation
        head.rotation.set(
          THREE.MathUtils.lerp(head.rotation.x, relXRot, 0.1),
          THREE.MathUtils.lerp(head.rotation.y, relYRot, 0.1),
          0
        )

      } else if (relYRot > -Math.PI / 2 && relYRot < 0) {
        console.log('greater than pi/2')
        head.rotation.set(
          THREE.MathUtils.lerp(head.rotation.x, relXRot, 0.1),
          THREE.MathUtils.lerp(head.rotation.y, relYRot, 0.1),
          0
        )
      }
      }
  })

  return (
    <>
      <FrameLimiter fps={120} />
      {/* <axesHelper args={[5]} /> */}

      <Environment preset="forest" />

      <ambientLight intensity={0.8} />
      <group rotation={[0, 0, Math.PI / 6]}>
        {/* <RotatingGroup> */}
          <Chibi ref={chibiRef} coreRef={coreRef} />
        {/* </RotatingGroup> */}

      </group>
    </>
    
  )
}





function TestPage03() {



  return (
    <div className='flex justify-center flex-col h-[100vh] w-full' style={{ backgroundImage: 'url(images/marble_bg.jpg)', backgroundSize: 'cover' }}>
      <RightOverlay />
      <LeftOverlay />
      <div className='w-[100vw] h-[100vh] items-center justify-center self-center block'>
        <Canvas camera={{ position: [0.8, -1, 10], rotation: [0, 0, 0] }} dpr={0.9}>
          <MyScene />
        </Canvas>
      </div>
    </div>
  )
}

export default TestPage03