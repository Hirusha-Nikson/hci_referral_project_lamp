"use client";
import { RoomConfig } from '@/lib/store'

interface RoomEnvironmentProps {
  config: RoomConfig
}

export function RoomEnvironment({ config }: RoomEnvironmentProps) {
  const { width, length, height, floorColor, wallColor } = config

  return (
    <group>
      {/* Floor */}
      <mesh position={[width / 2, -0.01, length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Grid on floor for reference */}
      <gridHelper 
        args={[Math.max(width, length), Math.max(width, length)]} 
        position={[width / 2, 0, length / 2]}
        material-color="#888888"
        material-opacity={0.1}
        material-transparent={true}
      />

      {/* Walls */}
      {config.shape === 'rectangle' || config.shape === 'square' ? (
        <>
          {/* Back wall */}
          <mesh position={[width / 2, height / 2, 0]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
          
          {/* Right wall */}
          <mesh position={[width, height / 2, length / 2]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[length, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
          
          {/* Front wall */}
          <mesh position={[width / 2, height / 2, length]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
          
          {/* Left wall */}
          <mesh position={[0, height / 2, length / 2]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[length, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
        </>
      ) : (
        // L-shape walls (simplified)
        <>
          {/* Main back wall */}
          <mesh position={[width * 0.6, height / 2, 0]}>
            <planeGeometry args={[width * 0.6, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
          
          {/* L-shape extension wall */}
          <mesh position={[width, height / 2, length * 0.4]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[length * 0.4, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
          
          {/* Internal corner walls for L-shape */}
          <mesh position={[width * 0.6, height / 2, length * 0.4]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[width * 0.4, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
          
          <mesh position={[width * 0.6, height / 2, length * 0.4]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[length * 0.6, height]} />
            <meshStandardMaterial color={wallColor} side={2} />
          </mesh>
        </>
      )}

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      
      {/* Key light */}
      <directionalLight
        position={[width + 2, height + 2, length + 2]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-2, height, -2]}
        intensity={0.3}
      />
      
      {/* Rim light */}
      <pointLight
        position={[width / 2, height - 0.5, length / 2]}
        intensity={0.4}
        distance={Math.max(width, length)}
        decay={2}
      />
    </group>
  )
}