"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAppStore } from "@/lib/store"
import { LampDesk } from "lucide-react"
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isLoggedIn, login } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard")
    }
  }, [isLoggedIn, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password to continue.")
      return
    }

    setIsLoading(true)

    // Simulate login process with dummy values
    setTimeout(() => {
      if (username === "demo" && password === "1234") {
        login(username.trim())
        toast.success(`Welcome ${username}, logged in successfully!`)
        router.push("/dashboard")
      } else {
        toast.error("Invalid username or password. Try demo / 1234.")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-workspace flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
            <LampDesk className="w-10 h-10 text-primary-foreground stroke-1 fill-amber-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Furniture Design Studio</CardTitle>
            <CardDescription className="mt-2">
              Professional furniture visualization and room design tool
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="transition-smooth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="transition-smooth"
              />
            </div>

            <Button
              type="submit"
              className="w-full transition-smooth"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Continue to Studio"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              This is a demo version with mock authentication.
              <br />
              Use <span className="font-semibold">Username:</span> <code>demo</code> &nbsp; 
              <span className="font-semibold">Password:</span> <code>1234</code> to access the design studio.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
