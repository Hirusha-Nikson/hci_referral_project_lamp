'use client';
import {
  Plus,
  FolderOpen,
  Save,
  Settings,
  LogOut,
  Eye,
  Trash2,
  LampDesk,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function DashboardSidebar() {
  const {
    userName,
    projects,
    currentProject,
    createNewProject,
    loadProject,
    saveProject,
    deleteProject,
    logout,
    toggleRoomSetup,
  } = useAppStore();

  const handleNewProject = () => {
    const projectName = `Design ${projects.length + 1}`;
    createNewProject(projectName);
    toast({
      title: "New Project Created",
      description: `"${projectName}" is ready for design.`,
    });
  };

  const handleSaveProject = () => {
    if (currentProject) {
      saveProject();
      toast({
        title: "Project Saved",
        description: `"${currentProject.name}" has been saved successfully.`,
      });
    }
  };

  const handleDeleteProject = (
    projectId: string,
    projectName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    deleteProject(projectId);
    toast({
      title: "Project Deleted",
      description: `"${projectName}" has been removed.`,
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {/* <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
            <LampDesk className="w-8 h-8 text-primary-foreground stroke-1 fill-amber-400" />
          </div> */}
          <div>
            <h2 className="font-semibold text-sidebar-foreground">
              Lamp Studio
            </h2>
            <p className="text-sm text-sidebar-foreground/70">
              Welcome, {userName}
            </p>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="p-6 space-y-3">
        <Button
          onClick={handleNewProject}
          className="w-full justify-start gap-2 bg-amber-400 text-black dark:text-primary-foreground hover:bg-amber-400/90"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Create New Design
        </Button>

        <Button
          onClick={() => toggleRoomSetup(true)}
          variant="outline"
          className="w-full justify-start gap-2"
          size="sm"
          disabled={!currentProject}
        >
          <Settings className="w-4 h-4" />
          Room Setup
        </Button>

        <Button
          onClick={handleSaveProject}
          variant="outline"
          className="w-full justify-start gap-2"
          size="sm"
          disabled={!currentProject}
        >
          <Save className="w-4 h-4" />
          Save Project
        </Button>
      </div>

      <Separator />

      {/* Projects List */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-6 pb-3">
          <h3 className="font-medium text-sidebar-foreground flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Your Designs ({projects.length})
          </h3>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-2 pb-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-sidebar-foreground/50 text-sm">
                  No designs yet
                  <br />
                  Create your first project above
                </div>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`
                    group relative p-3 rounded-lg border cursor-pointer transition-smooth
                    ${
                      currentProject?.id === project.id
                        ? "bg-sidebar-accent border-sidebar-primary text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 border-transparent"
                    }
                  `}
                  onClick={() => loadProject(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-sidebar-foreground/60 mt-1">
                        {project.furniture.length} items
                      </p>
                      <p className="text-xs text-sidebar-foreground/50">
                        {format(new Date(project.updatedAt), "MMM d, yyyy")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 hover:bg-sidebar-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadProject(project.id);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) =>
                          handleDeleteProject(project.id, project.name, e)
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          size="sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
