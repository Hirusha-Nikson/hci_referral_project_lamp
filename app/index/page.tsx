"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAppStore } from "@/lib/store"
import { ArrowRight, Box, LampDesk, Layout, Palette } from "lucide-react"

const Index = () => {
  const router = useRouter()
  const { isLoggedIn } = useAppStore()

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard")
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-gradient-workspace flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6">
              <LampDesk className="w-10 h-10 text-primary-foreground fill-amber-400 stroke-1" />
            </div>

            <h1 className="text-5xl font-bold text-center flex flex-col space-y-3">
              <span className="text-amber-400">Lamp</span>
              <span className="">Furniture Design Studio</span>
            </h1>

            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Professional furniture visualization and room design tool.
              Create stunning 2D and 3D room layouts with an intuitive, modern interface.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-gradient-card border-border hover:shadow-lg hover:shadow-amber-300/10 transition-shadow duration-300 ease-in-out">
              <CardHeader>
                <Layout className="w-8 h-8 text-primary mb-2 stroke-1 dark:stroke-amber-400 fill-amber-400 dark:fill-none" />
                <CardTitle className="text-lg">2D Floor Planning</CardTitle>
                <CardDescription>
                  Design room layouts with precise measurements and drag-and-drop furniture placement
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border hover:shadow-lg hover:shadow-amber-300/10 transition-shadow duration-300 ease-in-out">
              <CardHeader>
                <Box className="w-8 h-8 text-primary mb-2 stroke-1 dark:stroke-amber-400 fill-amber-400 dark:fill-none" />
                <CardTitle className="text-lg">3D Visualization</CardTitle>
                <CardDescription>
                  Experience your designs in immersive 3D with realistic lighting and materials
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-card border-border hover:shadow-lg hover:shadow-amber-300/10 transition-shadow duration-300 ease-in-out">
              <CardHeader>
                <Palette className="w-8 h-8 text-primary mb-2 stroke-1 dark:stroke-amber-400 fill-amber-400 dark:fill-none" />
                <CardTitle className="text-lg">Customization</CardTitle>
                <CardDescription>
                  Personalize colors, materials, and room configurations to match your vision
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-large hover:shadow-medium transition-smooth"
              onClick={() => router.push("/login")}
            >
              Start Designing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>
          Lamp Design Studio - Professional furniture visualization tool
        </p>
      </footer>
    </div>
  )
}

export default Index
