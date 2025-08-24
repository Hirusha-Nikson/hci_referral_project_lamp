import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Furniture item interface
interface FurnitureItem {
  id: string
  name: string
  type: 'chair' | 'table' | 'sofa' | 'bed' | 'cabinet' | 'shelf'
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  color: string
  size: { width: number; height: number; depth: number }
}

// Room configuration interface
interface RoomConfig {
  width: number
  length: number
  height: number
  shape: 'rectangle' | 'square' | 'l-shape'
  floorColor: string
  wallColor: string
  floorTexture?: string
  wallTexture?: string
}

// Design project interface
interface DesignProject {
  id: string
  name: string
  roomConfig: RoomConfig
  furniture: FurnitureItem[]
  createdAt: Date
  updatedAt: Date
}

// App state interface
interface AppState {
  // Authentication
  isLoggedIn: boolean
  userName: string
  
  // Current project
  currentProject: DesignProject | null
  projects: DesignProject[]
  
  // UI state
  activeView: '2d' | '3d'
  selectedFurniture: string | null
  showRoomSetup: boolean
  showFurniturePanel: boolean
  
  // Camera and viewport
  cameraPosition: { x: number; y: number; z: number }
  cameraTarget: { x: number; y: number; z: number }
  
  // Actions
  login: (userName: string) => void
  logout: () => void
  setActiveView: (view: '2d' | '3d') => void
  setSelectedFurniture: (id: string | null) => void
  
  // Project management
  createNewProject: (name: string) => void
  loadProject: (projectId: string) => void
  saveProject: () => void
  deleteProject: (projectId: string) => void
  
  // Room configuration
  updateRoomConfig: (config: Partial<RoomConfig>) => void
  toggleRoomSetup: (show?: boolean) => void
  
  // Furniture management
  addFurniture: (furniture: Omit<FurnitureItem, 'id'>) => void
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void
  removeFurniture: (id: string) => void
  duplicateFurniture: (id: string) => void
  toggleFurniturePanel: (show?: boolean) => void
  
  // Camera controls
  setCameraPosition: (position: { x: number; y: number; z: number }) => void
  setCameraTarget: (target: { x: number; y: number; z: number }) => void
  resetCamera: () => void
}

// Default room configuration
const defaultRoomConfig: RoomConfig = {
  width: 5,
  length: 5,
  height: 2.7,
  shape: 'rectangle',
  floorColor: '#F5F5F0',
  wallColor: '#FFFFFF'
}

// Default project template
const createDefaultProject = (name: string): DesignProject => ({
  id: `project-${Date.now()}`,
  name,
  roomConfig: defaultRoomConfig,
  furniture: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoggedIn: false,
      userName: '',
      currentProject: null,
      projects: [],
      activeView: '3d',
      selectedFurniture: null,
      showRoomSetup: false,
      showFurniturePanel: true,
      cameraPosition: { x: 5, y: 5, z: 5 },
      cameraTarget: { x: 0, y: 0, z: 0 },

      // Authentication actions
      login: (userName) => {
        set({ isLoggedIn: true, userName })
      },

      logout: () => {
        set({ 
          isLoggedIn: false, 
          userName: '', 
          currentProject: null,
          selectedFurniture: null 
        })
      },

      // UI actions
      setActiveView: (view) => set({ activeView: view }),
      setSelectedFurniture: (id) => set({ selectedFurniture: id }),

      // Project management
      createNewProject: (name) => {
        const newProject = createDefaultProject(name)
        const projects = [...get().projects, newProject]
        set({ projects, currentProject: newProject })
      },

      loadProject: (projectId) => {
        const project = get().projects.find(p => p.id === projectId)
        if (project) {
          set({ currentProject: project, selectedFurniture: null })
        }
      },

      saveProject: () => {
        const { currentProject, projects } = get()
        if (currentProject) {
          const updatedProject = { ...currentProject, updatedAt: new Date() }
          const updatedProjects = projects.map(p => 
            p.id === currentProject.id ? updatedProject : p
          )
          set({ projects: updatedProjects, currentProject: updatedProject })
        }
      },

      deleteProject: (projectId) => {
        const { projects, currentProject } = get()
        const updatedProjects = projects.filter(p => p.id !== projectId)
        const newCurrentProject = currentProject?.id === projectId ? null : currentProject
        set({ projects: updatedProjects, currentProject: newCurrentProject })
      },

      // Room configuration
      updateRoomConfig: (config) => {
        const { currentProject } = get()
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            roomConfig: { ...currentProject.roomConfig, ...config },
            updatedAt: new Date()
          }
          set({ currentProject: updatedProject })
        }
      },

      toggleRoomSetup: (show) => {
        set({ showRoomSetup: show ?? !get().showRoomSetup })
      },

      // Furniture management
      addFurniture: (furniture) => {
        const { currentProject } = get()
        if (currentProject) {
          const newFurniture: FurnitureItem = {
            ...furniture,
            id: `furniture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }
          const updatedProject = {
            ...currentProject,
            furniture: [...currentProject.furniture, newFurniture],
            updatedAt: new Date()
          }
          set({ currentProject: updatedProject })
        }
      },

      updateFurniture: (id, updates) => {
        const { currentProject } = get()
        if (currentProject) {
          const updatedFurniture = currentProject.furniture.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
          const updatedProject = {
            ...currentProject,
            furniture: updatedFurniture,
            updatedAt: new Date()
          }
          set({ currentProject: updatedProject })
        }
      },

      removeFurniture: (id) => {
        const { currentProject, selectedFurniture } = get()
        if (currentProject) {
          const updatedFurniture = currentProject.furniture.filter(item => item.id !== id)
          const updatedProject = {
            ...currentProject,
            furniture: updatedFurniture,
            updatedAt: new Date()
          }
          const newSelectedFurniture = selectedFurniture === id ? null : selectedFurniture
          set({ currentProject: updatedProject, selectedFurniture: newSelectedFurniture })
        }
      },

      duplicateFurniture: (id) => {
        const { currentProject } = get()
        if (currentProject) {
          const originalItem = currentProject.furniture.find(item => item.id === id)
          if (originalItem) {
            const duplicatedItem: FurnitureItem = {
              ...originalItem,
              id: `furniture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              position: {
                x: originalItem.position.x + 1,
                y: originalItem.position.y,
                z: originalItem.position.z + 1
              }
            }
            const updatedProject = {
              ...currentProject,
              furniture: [...currentProject.furniture, duplicatedItem],
              updatedAt: new Date()
            }
            set({ currentProject: updatedProject })
          }
        }
      },

      toggleFurniturePanel: (show) => {
        set({ showFurniturePanel: show ?? !get().showFurniturePanel })
      },

      // Camera controls
      setCameraPosition: (position) => set({ cameraPosition: position }),
      setCameraTarget: (target) => set({ cameraTarget: target }),
      resetCamera: () => set({ 
        cameraPosition: { x: 5, y: 5, z: 5 },
        cameraTarget: { x: 0, y: 0, z: 0 }
      })
    }),
    {
      name: 'furniture-design-app',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userName: state.userName,
        projects: state.projects,
        currentProject: state.currentProject
      })
    }
  )
)

// Furniture templates for quick access
export const furnitureTemplates = {
  chair: {
    name: 'Modern Chair',
    type: 'chair' as const,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#8B7355',
    size: { width: 0.6, height: 0.8, depth: 0.6 }
  },
  table: {
    name: 'Dining Table',
    type: 'table' as const,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#654321',
    size: { width: 1.8, height: 0.75, depth: 0.9 }
  },
  sofa: {
    name: 'Modern Sofa',
    type: 'sofa' as const,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#4A5568',
    size: { width: 2.2, height: 0.85, depth: 0.9 }
  },
  bed: {
    name: 'Queen Bed',
    type: 'bed' as const,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#2D3748',
    size: { width: 2.0, height: 0.6, depth: 1.6 }
  },
  cabinet: {
    name: 'Storage Cabinet',
    type: 'cabinet' as const,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#744210',
    size: { width: 1.2, height: 1.8, depth: 0.4 }
  },
  shelf: {
    name: 'Book Shelf',
    type: 'shelf' as const,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#8B4513',
    size: { width: 0.8, height: 2.0, depth: 0.3 }
  }
}

export type { FurnitureItem, RoomConfig, DesignProject }