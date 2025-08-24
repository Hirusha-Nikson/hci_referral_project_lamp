"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { RoomSetupModal } from "@/components/dashboard/room-setup-modal";
import { FurniturePanel } from "@/components/dashboard/furniture-panel";
import { Scene3D } from "@/components/3d/scene-3d";
import { Scene2D } from "@/components/2d/scene-2d";
import { useAppStore } from "@/lib/store";
import { Grid3X3, Save, Settings, Monitor, LampDesk } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const router = useRouter();
  const {
    isLoggedIn,
    currentProject,
    activeView,
    setActiveView,
    saveProject,
    toggleRoomSetup,
  } = useAppStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const handleSave = () => {
    try {
      toast.success("Project saved successfully!");
      saveProject();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-workspace flex flex-col ove">
      {/* Top Navigation */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <LampDesk className="w-7 h-7 text-primary-background stroke-1 fill-amber-400 dark:stroke-black" />
            </div>
            <div>
              <h1 className="font-semibold">Furniture Design Studio</h1>
              {currentProject && (
                <p className="text-sm text-muted-foreground">
                  {currentProject.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as "2d" | "3d")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="2d" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                2D
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                3D
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleRoomSetup(true)}
            disabled={!currentProject}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Room
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!currentProject}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Workspace */}
        <div className="flex-1 flex min-h-0">
          {/* Main Canvas Area */}
          <div className="flex-1 bg-gradient-workspace">
            <Tabs value={activeView} className="h-full flex flex-col">
              <TabsContent
                value="2d"
                className="flex-1 m-0 data-[state=inactive]:hidden"
              >
                <Scene2D />
              </TabsContent>
              <TabsContent
                value="3d"
                className="flex-1 m-0 data-[state=inactive]:hidden"
              >
                <Scene3D />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Furniture Library */}
          <FurniturePanel />
        </div>
      </div>

      {/* Modals */}
      <RoomSetupModal />
    </div>
  );
};

export default Dashboard;
