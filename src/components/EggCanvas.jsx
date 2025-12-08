import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'

const EggModel = ({ pointer }) => {
  const group = useRef()
  const { scene } = useGLTF('/models/egg-crete-ball.glb')

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.color.set('#ffe7f9')
      child.material.emissive?.set('#ffc0e3')
      child.material.metalness = 0.08
      child.material.roughness = 0.25
      if (child.material.sheenColor) {
        child.material.sheenColor.set('#ffd97a')
      }
    }
  })

  const baseRotationY = Math.PI / 2

  const floatOffsetY = 0.8

  useFrame((_, delta) => {
    if (!group.current) return
    const targetRotY = baseRotationY + pointer.x * 0.9
    const targetRotX = pointer.y * 0.5
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.25 * (1 + delta * 30)
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.25 * (1 + delta * 30)

    const targetX = pointer.x * 0.4
    const targetY = floatOffsetY + pointer.y * 0.2
    group.current.position.x += (targetX - group.current.position.x) * 0.25 * (1 + delta * 30)
    group.current.position.y += (targetY - group.current.position.y) * 0.25 * (1 + delta * 30)
  })

  return <primitive ref={group} object={scene} dispose={null} scale={310} />
}

const EggCanvas = ({ pointer }) => {
  const cameraPosition = useMemo(() => [0, 0.4, 18], [])

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: cameraPosition, fov: 45 }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} color="#fff4e1" />
        <directionalLight position={[2, 3, 2]} intensity={1} color="#ffd6f1" castShadow />
        <directionalLight position={[-4, -2, -4]} intensity={0.25} color="#ffbb7a" />
        <spotLight position={[0, 5, 5]} intensity={0.45} penumbra={1} angle={0.8} color="#ff9de5" />
        <EggModel pointer={pointer} />
        <ContactShadows
          position={[0, -4.6, 0]}
          opacity={0.14}
          blur={5.2}
          scale={18}
          far={6}
          color="#020205"
        />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/models/egg-crete-ball.glb')

export default EggCanvas
