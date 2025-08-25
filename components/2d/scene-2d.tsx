"use client";
import { useAppStore } from "@/lib/store"
import { useCallback, useRef } from "react"

export function Scene2D() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { currentProject, selectedFurniture, setSelectedFurniture, updateFurniture } = useAppStore()

  const handleFurnitureClick = useCallback(
    (itemId: string) => {
      setSelectedFurniture(selectedFurniture === itemId ? null : itemId)
    },
    [selectedFurniture, setSelectedFurniture]
  )

  const handleFurnitureDrag = useCallback(
    (itemId: string, newX: number, newZ: number) => {
      if (!currentProject) return

      const roomWidth = currentProject.roomConfig.width
      const roomLength = currentProject.roomConfig.length

      const clampedX = Math.max(0.5, Math.min(roomWidth - 0.5, newX))
      const clampedZ = Math.max(0.5, Math.min(roomLength - 0.5, newZ))

      updateFurniture(itemId, {
        position: { x: clampedX, y: 0, z: clampedZ },
      })
    },
    [currentProject, updateFurniture]
  )

  if (!currentProject) {
    return (
      <div className="flex-1 bg-canvas flex items-center justify-center h-screen">
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

  const roomConfig = currentProject.roomConfig
  const scale = 50
  const canvasWidth = roomConfig.width * scale + 100
  const canvasHeight = roomConfig.length * scale + 100

  return (
    <div className="flex-1 bg-canvas p-24 overflow-auto">
      <div className="min-w-full min-h-full flex items-center justify-center">
        <div
          ref={canvasRef}
          className="relative bg-canvas border-2 border-dashed border-canvas-grid rounded-lg shadow-large"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            minWidth: "600px",
            minHeight: "400px",
          }}
        >
          {/* Room outline */}
          <div
            className="absolute border-2 border-wall bg-floor/20"
            style={{
              left: 50,
              top: 50,
              width: roomConfig.width * scale,
              height: roomConfig.length * scale,
              backgroundColor: roomConfig.floorColor + "20",
              borderColor: roomConfig.wallColor,
            }}
          >
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
              <defs>
                <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                  <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="black" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Room dimensions */}
            <div className="absolute -top-8 left-0 right-0 text-center text-xs text-muted-foreground">
              {roomConfig.width}m
            </div>
            <div
              className="absolute -left-8 top-16 bottom-0 text-xs text-muted-foreground flex items-center"
              style={{ writingMode: "vertical-rl" }}
            >
              {roomConfig.length}m
            </div>

            {/* Furniture */}
            {currentProject.furniture.map((item) => {
              const x = item.position.x * scale
              const z = item.position.z * scale
              const width = item.size.width * scale
              const depth = item.size.depth * scale
              const isSelected = selectedFurniture === item.id

              return (
                <div
                  key={item.id}
                  className={`absolute cursor-pointer transition-smooth rounded-sm border-2 flex items-center justify-center text-xs font-medium
                    ${
                      isSelected
                        ? "border-selection bg-selection/20 text-selection shadow-medium"
                        : "border-furniture-default bg-furniture-default/30 hover:border-selection-hover hover:bg-selection-hover/20"
                    }`}
                  style={{
                    left: x - width / 2,
                    top: z - depth / 2,
                    width,
                    height: depth,
                    backgroundColor: item.color + "40",
                    borderColor: isSelected ? "var(--selection)" : item.color,
                    transform: `rotate(${(item.rotation.y * 180) / Math.PI}deg)`,
                  }}
                  onClick={() => handleFurnitureClick(item.id)}
                  onMouseDown={(e) => {
                    if (!isSelected) return

                    e.preventDefault()
                    const startX = e.clientX
                    const startZ = e.clientY
                    const startPosX = item.position.x
                    const startPosZ = item.position.z

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const deltaX = (moveEvent.clientX - startX) / scale
                      const deltaZ = (moveEvent.clientY - startZ) / scale
                      handleFurnitureDrag(item.id, startPosX + deltaX, startPosZ + deltaZ)
                    }

                    const handleMouseUp = () => {
                      document.removeEventListener("mousemove", handleMouseMove)
                      document.removeEventListener("mouseup", handleMouseUp)
                    }

                    document.addEventListener("mousemove", handleMouseMove)
                    document.addEventListener("mouseup", handleMouseUp)
                  }}
                >
                  <span className="select-none pointer-events-none">{item.name.split(" ")[0]}</span>

                  {item.rotation.y !== 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-selection rounded-full" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Overlay */}
          <div className="absolute top-4 right-2 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-medium">
            <p className="text-sm font-medium">2D Top-Down View</p>
            <p className="text-xs text-muted-foreground">Click to select • Drag selected items to move</p>
          </div>

          {/* Legend */}
          {/* <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-medium">
            <p className="text-xs font-medium mb-2">Legend</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-furniture-default bg-furniture-default/30 rounded-sm" />
                <span>Furniture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-selection bg-selection/20 rounded-sm" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-canvas-grid" />
                <span>1 meter</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
