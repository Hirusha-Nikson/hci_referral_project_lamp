"use client";

import { useRef } from "react"
import { Group } from "three"
import { useFrame } from "@react-three/fiber"
import { useAppStore } from "@/lib/store"
import type { FurnitureItem } from "@/lib/store"

interface FurnitureModelProps {
  item: FurnitureItem
}

export function FurnitureModel({ item }: FurnitureModelProps) {
  const meshRef = useRef<Group>(null)
  const { selectedFurniture, setSelectedFurniture } = useAppStore()

  const isSelected = selectedFurniture === item.id

  // Subtle hover animation for selected items
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y =
        item.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.02
    }
  })

  // Create geometry based on furniture type
  const getGeometry = () => {
    switch (item.type) {
      case "chair":
        return (
          <group>
            {/* Seat */}
            <mesh position={[0, item.size.height * 0.4, 0]}>
              <boxGeometry args={[item.size.width, 0.1, item.size.depth]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, item.size.height * 0.7, -item.size.depth * 0.4]}>
              <boxGeometry
                args={[item.size.width, item.size.height * 0.6, 0.1]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Legs */}
            {[-0.2, 0.2]
              .map((x) =>
                [-0.2, 0.2].map((z) => (
                  <mesh
                    key={`${x}-${z}`}
                    position={[x, item.size.height * 0.2, z]}
                  >
                    <cylinderGeometry
                      args={[0.02, 0.02, item.size.height * 0.4]}
                    />
                    <meshStandardMaterial color={item.color} />
                  </mesh>
                ))
              )
              .flat()}
          </group>
        )

      case "table":
        return (
          <group>
            {/* Top */}
            <mesh position={[0, item.size.height, 0]}>
              <boxGeometry args={[item.size.width, 0.05, item.size.depth]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Legs */}
            {[-item.size.width * 0.4, item.size.width * 0.4]
              .map((x) =>
                [-item.size.depth * 0.4, item.size.depth * 0.4].map((z) => (
                  <mesh
                    key={`${x}-${z}`}
                    position={[x, item.size.height * 0.5, z]}
                  >
                    <cylinderGeometry args={[0.03, 0.03, item.size.height]} />
                    <meshStandardMaterial color={item.color} />
                  </mesh>
                ))
              )
              .flat()}
          </group>
        )

      case "sofa":
        return (
          <group>
            {/* Base */}
            <mesh position={[0, item.size.height * 0.3, 0]}>
              <boxGeometry
                args={[item.size.width, item.size.height * 0.4, item.size.depth]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Backrest */}
            <mesh
              position={[0, item.size.height * 0.7, -item.size.depth * 0.3]}
            >
              <boxGeometry
                args={[item.size.width, item.size.height * 0.6, 0.2]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Arms */}
            {[-item.size.width * 0.4, item.size.width * 0.4].map((x) => (
              <mesh key={x} position={[x, item.size.height * 0.6, 0]}>
                <boxGeometry
                  args={[0.15, item.size.height * 0.4, item.size.depth * 0.8]}
                />
                <meshStandardMaterial color={item.color} />
              </mesh>
            ))}
          </group>
        )

      case "bed":
        return (
          <group>
            {/* Mattress */}
            <mesh position={[0, item.size.height, 0]}>
              <boxGeometry args={[item.size.width, 0.2, item.size.depth]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Frame */}
            <mesh position={[0, item.size.height * 0.4, 0]}>
              <boxGeometry
                args={[
                  item.size.width + 0.1,
                  item.size.height * 0.6,
                  item.size.depth + 0.1,
                ]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Headboard */}
            <mesh
              position={[0, item.size.height * 1.2, -item.size.depth * 0.5]}
            >
              <boxGeometry
                args={[item.size.width, item.size.height * 0.8, 0.1]}
              />
              <meshStandardMaterial color={item.color} />
            </mesh>
          </group>
        )

      case "cabinet":
        return (
          <mesh>
            <boxGeometry
              args={[item.size.width, item.size.height, item.size.depth]}
            />
            <meshStandardMaterial color={item.color} />
          </mesh>
        )

      case "shelf":
        return (
          <group>
            {/* Frame */}
            <mesh position={[0, item.size.height * 0.5, 0]}>
              <boxGeometry
                args={[item.size.width, item.size.height, item.size.depth]}
              />
              <meshStandardMaterial
                color={item.color}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Shelves */}
            {[0.2, 0.5, 0.8].map((y) => (
              <mesh key={y} position={[0, item.size.height * y, 0]}>
                <boxGeometry
                  args={[
                    item.size.width - 0.02,
                    0.02,
                    item.size.depth - 0.02,
                  ]}
                />
                <meshStandardMaterial color={item.color} />
              </mesh>
            ))}
          </group>
        )

      default:
        return (
          <mesh>
            <boxGeometry
              args={[item.size.width, item.size.height, item.size.depth]}
            />
            <meshStandardMaterial color={item.color} />
          </mesh>
        )
    }
  }

  return (
    <group
      ref={meshRef}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
      scale={[item.scale.x, item.scale.y, item.scale.z]}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedFurniture(item.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default"
      }}
    >
      {getGeometry()}

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <boxGeometry
            args={[
              item.size.width + 0.1,
              item.size.height + 0.1,
              item.size.depth + 0.1,
            ]}
          />
          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}
