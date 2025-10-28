import { DataCollector } from "@/components/data-collector";

export default function CollectPage() {
  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen items-center justify-center p-4">
      <DataCollector />
    </div>
  );
}
