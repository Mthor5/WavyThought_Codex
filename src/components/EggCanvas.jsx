import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'

const EggModel = ({ pointer }) => {
  const group = useRef()
  const { scene } = useGLTF('/models/egg-crete-ball.glb')

  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.color.set('#fff7f1')
      child.material.emissive?.set('#fbeaea')
      child.material.metalness = 0.05
      child.material.roughness = 0.2
    }
  })

  const baseRotationY = Math.PI / 2

  useFrame((_, delta) => {
    if (!group.current) return
    const targetRotY = baseRotationY + pointer.x * 0.9
    const targetRotX = pointer.y * 0.5
    group.current.rotation.y += (targetRotY - group.current.rotation.y) * 0.25 * (1 + delta * 30)
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * 0.25 * (1 + delta * 30)

    const targetX = pointer.x * 0.4
    const targetY = pointer.y * 0.2
    group.current.position.x += (targetX - group.current.position.x) * 0.25 * (1 + delta * 30)
    group.current.position.y += (targetY - group.current.position.y) * 0.25 * (1 + delta * 30)
  })

  return <primitive ref={group} object={scene} dispose={null} scale={440} />
}

const EggCanvas = ({ pointer }) => {
  const cameraPosition = useMemo(() => [0, 0.4, 14], [])

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: cameraPosition, fov: 45 }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} color="#fff5eb" />
        <directionalLight position={[2, 3, 2]} intensity={1} color="#ffffff" castShadow />
        <directionalLight position={[-4, -2, -4]} intensity={0.2} color="#ffcfdf" />
        <spotLight position={[0, 5, 5]} intensity={0.35} penumbra={1} angle={0.8} color="#ffd7ef" />
        <EggModel pointer={pointer} />
        <ContactShadows
          position={[0, -3.8, 0]}
          opacity={0.12}
          blur={4.5}
          scale={16}
          far={4.5}
          color="#020205"
        />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/models/egg-crete-ball.glb')

export default EggCanvas
