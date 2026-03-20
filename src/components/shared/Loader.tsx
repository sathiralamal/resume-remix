import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in-up">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm font-medium text-muted-foreground tracking-wide">
        {message}
      </p>
    </div>
  );
}
