import { GestureHandler } from "@/components/gesture-handler";

export default function LivePage() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen items-center justify-center p-4">
      <GestureHandler />
    </div>
  );
}
