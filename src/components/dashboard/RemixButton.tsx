interface RemixButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function RemixButton({ onClick, disabled }: RemixButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 text-white font-bold rounded-lg transition-colors
        ${disabled 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transform hover:scale-[1.01] transition-transform"
        }`}
    >
      {disabled ? "Remixing..." : "✨ Remix My Resume"}
    </button>
  );
}
