import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const ModelPrimitive = ({ src }) => {
  const gltf = useLoader(GLTFLoader, src)
  const sceneObject = useMemo(() => gltf.scene || gltf.scenes?.[0], [gltf])
  if (!sceneObject) return null
  return <primitive object={sceneObject} dispose={null} rotation={[Math.PI / 2, Math.PI, Math.PI]} />
}

const INITIAL_CAMERA = [0, 0, 3.2]
const INITIAL_TARGET = [0, 0, 0]

const ModelViewerSlide = ({ src, isDark = false }) => {
  const [resetCounter, setResetCounter] = useState(0)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const initialCameraRef = useRef(null)

  useEffect(() => {
    initialCameraRef.current = null
    let cancelled = false
    const attemptCapture = () => {
      if (cancelled) return
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(0, 0, 2.2)
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
        initialCameraRef.current = {
          position: cameraRef.current.position.clone(),
          target: controlsRef.current.target.clone(),
        }
      } else {
        setTimeout(attemptCapture, 100)
      }
    }
    setTimeout(attemptCapture, 200)
    return () => {
      cancelled = true
    }
  }, [src, resetCounter])

  const resetView = () => {
    const initial = initialCameraRef.current
    if (!initial || !cameraRef.current || !controlsRef.current) return
    cameraRef.current.position.copy(initial.position)
    controlsRef.current.target.copy(initial.target)
    controlsRef.current.update()
  }

  const overlayButtonClass = isDark
    ? 'border-white/40 text-white/80 hover:bg-white/15'
    : 'border-[#1f1b1f]/30 text-[#1f1b1f] hover:bg-white/90'
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center text-[0.65rem] uppercase tracking-[0.35em]">
            Loading 3D...
          </div>
        }
      >
        <Canvas
          key={`${src}-${resetCounter}`}
          camera={{ position: INITIAL_CAMERA, fov: 25 }}
          style={{ width: '100%', height: '100%' }}
          dpr={[1, 1.5]}
          onCreated={({ camera }) => {
            cameraRef.current = camera
          }}
        >
          <Stage environment={isDark ? 'night' : 'city'} intensity={0.8} shadows={false} adjustCamera>
            <ModelPrimitive src={src} />
          </Stage>
          <OrbitControls ref={controlsRef} enablePan={false} />
        </Canvas>
      </Suspense>
      <button
        type="button"
        onClick={() => {
          setResetCounter((prev) => prev + 1)
          resetView()
        }}
        className={`pointer-events-auto absolute bottom-3 right-3 rounded-full border px-4 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.35em] backdrop-blur transition ${overlayButtonClass}`}
      >
        Reset View
      </button>
    </div>
  )
}

export default ModelViewerSlide
