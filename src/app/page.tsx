import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Bot, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          GestureTalk
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Control and communicate with your Smart Gesture Glove.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
          <Link href="/live" className="w-full">
            <Button size="lg" className="w-full h-24 text-lg">
              <Bot className="mr-2 h-6 w-6" />
              Live Mode
            </Button>
          </Link>
          <Link href="/collect" className="w-full">
            <Button size="lg" variant="secondary" className="w-full h-24 text-lg">
              <Database className="mr-2 h-6 w-6" />
              Collect Data
            </Button>
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-muted-foreground text-sm">
          <p>
            Built for the Smart Gesture Glove project.
            <Link href="https://github.com/firebase/genkit-patterns/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-2 ml-2">
               Source Code <Github className="h-4 w-4" />
            </Link>
          </p>
        </footer>
    </div>
  );
}
