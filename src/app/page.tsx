import { GestureHandler } from "@/components/gesture-handler";
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen items-center justify-center p-4 relative">
        <GestureHandler />
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
