"use client";
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { RoomEnvironment } from './room-environment'
import { FurnitureModel } from './furniture-model'
import { useAppStore } from '@/lib/store'

export function Scene3D() {
  const { currentProject, setSelectedFurniture } = useAppStore()
  
  if (!currentProject) {
    return (
      // Add h-screen to take full viewport height
      <div className="flex-1 h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-muted-foreground rounded opacity-20" />
          </div>
          <p className="text-muted-foreground">No project loaded</p>
          <p className="text-sm text-muted-foreground/70">Create a new project to start designing</p>
        </div>
      </div>
    )
  }

  const roomCenter = {
    x: currentProject.roomConfig.width / 2,
    y: 0,
    z: currentProject.roomConfig.length / 2
  }

  return (
    // Add h-screen to take full viewport height
    <div className="flex-1 h-[calc(100vh-3.5rem)] bg-canvas relative">
      <Canvas
        camera={{ 
          position: [
            roomCenter.x + 5, 
            currentProject.roomConfig.height + 3, 
            roomCenter.z + 5
          ],
          fov: 50
        }}
        shadows
        onClick={() => setSelectedFurniture(null)}
        // Explicitly set Canvas to fill container
        style={{ 
          background: 'var(--canvas)',
          width: '100%',
          height: '100%'
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="apartment" />
          <RoomEnvironment config={currentProject.roomConfig} />
          {currentProject.furniture.map((item) => (
            <FurnitureModel key={item.id} item={item} />
          ))}
          <OrbitControls
            target={[roomCenter.x, 1, roomCenter.z]}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={2}
            maxDistance={20}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* UI Overlays remain unchanged */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-medium">
        <p className="text-sm font-medium">3D View</p>
        <p className="text-xs text-muted-foreground">
          Drag to orbit • Scroll to zoom • Click furniture to select
        </p>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-medium">
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Room:</span>
            <span>{currentProject.roomConfig.width}m × {currentProject.roomConfig.length}m</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Items:</span>
            <span>{currentProject.furniture.length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Shape:</span>
            <span className="capitalize">{currentProject.roomConfig.shape}</span>
          </div>
        </div>
      </div>
    </div>
  )
}