import { Sparkles } from "lucide-react";

interface RemixButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function RemixButton({ onClick, disabled }: RemixButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all 
        ${disabled 
          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60" 
          : "bg-primary text-primary-foreground btn-hover btn-active soft-shadow hover:shadow-primary/20"
        }`}
    >
      <Sparkles className="w-5 h-5" />
      {disabled ? "Readying Engine..." : "Tailor Resume"}
    </button>
  );
}
