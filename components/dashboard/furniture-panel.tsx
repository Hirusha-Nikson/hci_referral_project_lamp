"use client";
import { Plus, Trash2, Copy, Move, RotateCw, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore, furnitureTemplates } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

export function FurniturePanel() {
  const { 
    currentProject,
    selectedFurniture,
    addFurniture,
    updateFurniture,
    removeFurniture,
    duplicateFurniture,
    setSelectedFurniture
  } = useAppStore()

  if (!currentProject) return null

  const selectedItem = selectedFurniture 
    ? currentProject.furniture.find(item => item.id === selectedFurniture)
    : null

  const handleAddFurniture = (templateKey: keyof typeof furnitureTemplates) => {
    const template = furnitureTemplates[templateKey]
    addFurniture({
      ...template,
      position: {
        x: Math.random() * (currentProject.roomConfig.width - 1),
        y: 0,
        z: Math.random() * (currentProject.roomConfig.length - 1)
      }
    })
    toast({
      title: "Furniture Added",
      description: `${template.name} has been added to your design.`
    })
  }

  const handleDeleteSelected = () => {
    if (selectedItem) {
      removeFurniture(selectedItem.id)
      toast({
        title: "Furniture Removed",
        description: `${selectedItem.name} has been removed.`,
        variant: "destructive"
      })
    }
  }

  const handleDuplicateSelected = () => {
    if (selectedItem) {
      duplicateFurniture(selectedItem.id)
      toast({
        title: "Furniture Duplicated",
        description: `${selectedItem.name} has been duplicated.`
      })
    }
  }

  const handleUpdatePosition = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedItem) {
      updateFurniture(selectedItem.id, {
        position: { ...selectedItem.position, [axis]: value }
      })
    }
  }

  const handleUpdateRotation = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedItem) {
      updateFurniture(selectedItem.id, {
        rotation: { ...selectedItem.rotation, [axis]: value * Math.PI / 180 }
      })
    }
  }

  const handleUpdateColor = (color: string) => {
    if (selectedItem) {
      updateFurniture(selectedItem.id, { color })
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full overflow-y-scroll pt-4">
      {/* Header */}
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Furniture Library</CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1">
        <div className="px-6 space-y-6">
          {/* Add Furniture */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Add Furniture</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(furnitureTemplates).map(([key, template]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col gap-1"
                  onClick={() => handleAddFurniture(key as keyof typeof furnitureTemplates)}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">{template.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Current Furniture */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Scene Items</h3>
              <Badge variant="secondary">
                {currentProject.furniture.length}
              </Badge>
            </div>
            
            {currentProject.furniture.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No furniture in scene
                <br />
                Add items above to get started
              </div>
            ) : (
              <div className="space-y-2">
                {currentProject.furniture.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-smooth ${
                      selectedFurniture === item.id 
                        ? 'ring-2 ring-selection border-selection' 
                        : 'hover:shadow-medium'
                    }`}
                    onClick={() => setSelectedFurniture(item.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: item.color }}
                          />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {item.type}
                            </p>
                          </div>
                        </div>
                        {selectedFurniture === item.id && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateSelected()
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSelected()
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Selected Item Properties */}
          {selectedItem && (
            <div className="space-y-4 pb-6">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: selectedItem.color }}
                />
                {selectedItem.name} Properties
              </h3>

              {/* Position Controls */}
              <div className="space-y-3">
                <Label className="text-xs flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  Position (m)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedItem.position.x.toFixed(1)}
                      onChange={(e) => handleUpdatePosition('x', parseFloat(e.target.value) || 0)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedItem.position.y.toFixed(1)}
                      onChange={(e) => handleUpdatePosition('y', parseFloat(e.target.value) || 0)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Z</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedItem.position.z.toFixed(1)}
                      onChange={(e) => handleUpdatePosition('z', parseFloat(e.target.value) || 0)}
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation Controls */}
              <div className="space-y-3">
                <Label className="text-xs flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  Rotation (°)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input
                      type="number"
                      step="15"
                      value={Math.round(selectedItem.rotation.x * 180 / Math.PI)}
                      onChange={(e) => handleUpdateRotation('x', parseFloat(e.target.value) || 0)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input
                      type="number"
                      step="15"
                      value={Math.round(selectedItem.rotation.y * 180 / Math.PI)}
                      onChange={(e) => handleUpdateRotation('y', parseFloat(e.target.value) || 0)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Z</Label>
                    <Input
                      type="number"
                      step="15"
                      value={Math.round(selectedItem.rotation.z * 180 / Math.PI)}
                      onChange={(e) => handleUpdateRotation('z', parseFloat(e.target.value) || 0)}
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Color Control */}
              <div className="space-y-3">
                <Label className="text-xs flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedItem.color}
                    onChange={(e) => handleUpdateColor(e.target.value)}
                    className="w-12 h-8 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedItem.color}
                    onChange={(e) => handleUpdateColor(e.target.value)}
                    className="flex-1 font-mono text-xs h-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}