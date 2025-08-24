import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Lamp",
  description: "Furniture visualisation in 2D/3D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body cz-shortcut-listen="true">
        <ThemeProvider enableSystem={true} attribute="class">
          <TooltipProvider>
            <Toaster/>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
