# Frontend User-Centric Architecture Diagram

## Overview

This document provides a user-centric architecture diagram for the Lamp Furniture Design Studio application. The application is a Next.js-based furniture visualization tool that allows users to create 2D and 3D room designs.

## Architecture Diagram

```mermaid
graph TD
    A[User] --> B[Browser]
    B --> C[Next.js Application]
    
    C --> D[Home Page]
    C --> E[Login Page]
    C --> F[Dashboard]
    
    D --> D1[Loading Overlay]
    D --> D2[Landing Page Content]
    
    E --> E1[Login Form]
    E --> E2[Theme Toggle]
    
    F --> F1[Top Navigation]
    F --> F2[Dashboard Sidebar]
    F --> F3[Workspace Area]
    F --> F4[Modals]
    
    F1 --> F1A[View Toggle]
    F1 --> F1B[Room Setup Button]
    F1 --> F1C[Save Button]
    F1 --> F1D[Theme Toggle]
    
    F2 --> F2A[Project Management]
    F2 --> F2B[Project List]
    
    F3 --> F3A[2D Scene View]
    F3 --> F3B[3D Scene View]
    F3 --> F3C[Furniture Panel]
    
    F4 --> F4A[Room Setup Modal]
    
    F3A --> G1[2D Scene Component]
    F3B --> G2[3D Scene Component]
    
    G1 --> G1A[Canvas]
    G1 --> G1B[Grid]
    G1 --> G1C[Furniture Items]
    
    G2 --> G2A[Canvas]
    G2 --> G2B[Environment]
    G2 --> G2C[Furniture Models]
    G2 --> G2D[Camera Controls]
    
    style A fill:#4CAF50,stroke:#388E3C
    style B fill:#2196F3,stroke:#0D47A1
    style C fill:#FF9800,stroke:#E65100
    style D fill:#9C27B0,stroke:#4A148C
    style E fill:#9C27B0,stroke:#4A148C
    style F fill:#9C27B0,stroke:#4A148C
    style F1 fill:#00BCD4,stroke:#006064
    style F2 fill:#00BCD4,stroke:#006064
    style F3 fill:#00BCD4,stroke:#006064
    style F4 fill:#00BCD4,stroke:#006064
    style G1 fill:#8BC34A,stroke:#33691E
    style G2 fill:#8BC34A,stroke:#33691E
```

## Component Descriptions

### 1. User Interface Layer

#### Home Page
- **Loading Overlay**: Shows a loading animation when the page first loads
- **Landing Page Content**: Main content with:
  - Hero section with application title and description
  - Feature cards highlighting key functionality
  - Call-to-action button to start designing

#### Login Page
- **Login Form**: Form for user authentication with username and password fields
- **Theme Toggle**: Component to switch between light and dark themes

#### Dashboard
- **Top Navigation**: Header with:
  - View toggle (2D/3D)
  - Room setup button
  - Save button
  - Theme toggle
- **Dashboard Sidebar**: Navigation panel with:
  - Project management features
  - List of saved projects
- **Workspace Area**: Main content area with:
  - 2D Scene View
  - 3D Scene View
  - Furniture Panel
- **Modals**: Overlay dialogs including:
  - Room Setup Modal

### 2. Scene Components

#### 2D Scene Component
- **Canvas**: 2D rendering area
- **Grid**: Grid system for precise placement
- **Furniture Items**: Draggable furniture elements

#### 3D Scene Component
- **Canvas**: 3D rendering area using React Three Fiber
- **Environment**: Room environment with lighting and textures
- **Furniture Models**: 3D models of furniture items
- **Camera Controls**: Interactive camera for viewing the scene

### 3. State Management

The application uses Zustand for state management with the following key stores:

- **Authentication State**: Tracks user login status
- **Project State**: Manages current project and list of saved projects
- **UI State**: Controls active view (2D/3D), selected furniture, and panel visibility
- **Camera State**: Manages camera position and target
- **Furniture State**: Tracks furniture items in the current project

### 4. Data Flow

1. User interacts with UI components
2. UI actions update the application state via Zustand store
3. State changes trigger re-renders of relevant components
4. Components fetch data from the store as needed
5. For 3D visualization, React Three Fiber manages the WebGL rendering

## Key Features

- **Responsive Design**: Adapts to different screen sizes
- **Theme Support**: Light and dark mode options
- **2D/3D Visualization**: Switch between 2D floor plans and 3D room visualization
- **Drag-and-Drop**: Intuitive furniture placement
- **Project Management**: Save and load design projects
- **Real-time Preview**: See changes immediately in both 2D and 3D views

## Technologies Used

- **Next.js**: React framework for production
- **React**: UI library
- **Zustand**: State management
- **React Three Fiber**: 3D rendering
- **Tailwind CSS**: Styling
- **Shadcn/ui**: UI components
- **Lucide React**: Icons