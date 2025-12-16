import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, useProgress } from '@react-three/drei'

const preloadedModels = new Set()
const SUPPORTED_MODEL_EXTENSIONS = ['.glb', '.gltf']

const canPreload = (src) => {
  if (!src) return false
  const normalized = src.split('?')[0].toLowerCase()
  return SUPPORTED_MODEL_EXTENSIONS.some((ext) => normalized.endsWith(ext))
}

export const preloadModelAsset = (src) => {
  if (!canPreload(src) || preloadedModels.has(src)) return
  preloadedModels.add(src)
  if (typeof window === 'undefined') return
  try {
    useGLTF.preload(src)
  } catch {
    // Ignore eager preload errors; the Suspense loader will handle real failures.
  }
}

const ModelLoadingFallback = ({ isDark }) => {
  const { progress } = useProgress()
  const percent = Number.isFinite(progress) ? Math.min(100, Math.round(progress)) : 0
  const textClass = isDark ? 'text-white/80' : 'text-[#1f1b1f]'
  const barBg = isDark ? 'bg-white/20' : 'bg-[#1f1b1f]/15'
  const barFill = isDark ? 'bg-white/70' : 'bg-[#1f1b1f]'
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-4 text-[0.65rem] uppercase tracking-[0.35em] ${textClass}`}>
      <p>Loading 3D</p>
      <div className={`h-1 w-40 overflow-hidden rounded-full ${barBg}`}>
        <div className={`${barFill} h-full transition-all duration-300`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

const ModelPrimitive = ({ src, onLoaded }) => {
  const gltf = useGLTF(src)
  const sceneObject = useMemo(() => gltf.scene || gltf.scenes?.[0], [gltf])
  useEffect(() => {
    if (sceneObject && typeof onLoaded === 'function') {
      onLoaded()
    }
  }, [sceneObject, onLoaded])
  if (!sceneObject) return null
  return <primitive object={sceneObject} dispose={null} rotation={[Math.PI / 2, Math.PI, Math.PI]} />
}

const INITIAL_CAMERA = [0, 0, 3.2]

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
      <Suspense fallback={<ModelLoadingFallback isDark={isDark} />}>
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
            <ModelPrimitive
              src={src}
              onLoaded={() => {
                preloadModelAsset(src)
              }}
            />
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
