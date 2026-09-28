"use client"

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, PresentationControls } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'

function JewelryModel({ onLoad, zoomLevel }: { onLoad: () => void; zoomLevel: number }) {
  const { scene } = useGLTF('/3-stone-transformed.glb')
  
  // Call onLoad when the model is ready
  useEffect(() => {
    onLoad()
  }, [onLoad])
  
  return (
    <primitive 
      object={scene} 
      scale={[1.2 * zoomLevel, 1.2 * zoomLevel, 1.2 * zoomLevel]}
      position={[0, -0.5, 0]}
      rotation={[0, Math.PI * 0.1, 0]}
    />
  )
}

export default function Jewelry3DModel() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3))
  }
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
  }
  
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <JewelryModel onLoad={() => setIsLoaded(true)} zoomLevel={zoomLevel} />
          </PresentationControls>
          
          <Environment preset="studio" />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.8} />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
        </Suspense>
      </Canvas>
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
          title="Zoom In"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="text-white text-lg font-medium">Loading 3D Model...</div>
        </div>
      )}
    </div>
  )
} 