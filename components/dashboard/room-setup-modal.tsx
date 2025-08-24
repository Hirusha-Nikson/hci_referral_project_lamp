import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

const shapeOptions = [
  { value: 'rectangle', label: 'Rectangle', icon: '▭' },
  { value: 'square', label: 'Square', icon: '□' },
  { value: 'l-shape', label: 'L-Shape', icon: '⅃' }
] as const

const colorPresets = [
  { name: 'Classic White', floor: '#F5F5F0', wall: '#FFFFFF' },
  { name: 'Warm Beige', floor: '#F0E6D2', wall: '#FAF7F2' },
  { name: 'Modern Gray', floor: '#E5E7EB', wall: '#F3F4F6' },
  { name: 'Dark Oak', floor: '#8B4513', wall: '#F5F5DC' },
  { name: 'Cool Concrete', floor: '#BEBEBE', wall: '#E8E8E8' }
]

export function RoomSetupModal() {
  const { 
    showRoomSetup, 
    toggleRoomSetup, 
    currentProject, 
    updateRoomConfig,
    saveProject
  } = useAppStore()

  const [formData, setFormData] = useState<{
    width: number;
    length: number;
    height: number;
    shape: 'rectangle' | 'square' | 'l-shape';
    floorColor: string;
    wallColor: string;
  }>({
    width: 5,
    length: 5,
    height: 2.7,
    shape: 'rectangle',
    floorColor: '#F5F5F0',
    wallColor: '#FFFFFF'
  })

  useEffect(() => {
    if (currentProject?.roomConfig) {
      setFormData(currentProject.roomConfig)
    }
  }, [currentProject])

  const handleSave = () => {
    if (!currentProject) return

    updateRoomConfig(formData)
    saveProject()
    
    toast({
      title: "Room Updated",
      description: "Room configuration has been saved successfully."
    })
    
    toggleRoomSetup(false)
  }

  const handleColorPresetSelect = (preset: typeof colorPresets[0]) => {
    setFormData(prev => ({
      ...prev,
      floorColor: preset.floor,
      wallColor: preset.wall
    }))
  }

  return (
    <Dialog open={showRoomSetup} onOpenChange={(open) => toggleRoomSetup(open)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Room Configuration</DialogTitle>
          <DialogDescription>
            Set up your room dimensions, shape, and color scheme
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Dimensions (meters)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    width: parseFloat(e.target.value) || 1
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    length: parseFloat(e.target.value) || 1
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  min="2"
                  max="5"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    height: parseFloat(e.target.value) || 2
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Room Shape */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Room Shape</h3>
            <Select
              value={formData.shape}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                shape: value as typeof formData.shape
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {shapeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Presets */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Color Presets</h3>
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <Card
                  key={preset.name}
                  className="cursor-pointer hover:shadow-medium transition-smooth"
                  onClick={() => handleColorPresetSelect(preset)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: preset.floor }}
                      />
                      <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: preset.wall }}
                      />
                    </div>
                    <p className="text-xs font-medium">{preset.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Custom Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floorColor">Floor Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="floorColor"
                    type="color"
                    value={formData.floorColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      floorColor: e.target.value
                    }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.floorColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      floorColor: e.target.value
                    }))}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallColor">Wall Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallColor"
                    type="color"
                    value={formData.wallColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      wallColor: e.target.value
                    }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.wallColor}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      wallColor: e.target.value
                    }))}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => toggleRoomSetup(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Apply Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}