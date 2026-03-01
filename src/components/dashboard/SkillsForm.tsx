interface SkillsFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SkillsForm({ value, onChange }: SkillsFormProps) {
  return (
    <div className="space-y-2 animate-fade-in-up delay-200">
      <label className="block text-sm font-medium text-foreground">
        Core Competencies
      </label>
      <textarea
        className="w-full h-24 p-4 clean-input rounded-xl text-foreground placeholder-muted-foreground resize-none leading-relaxed"
        placeholder="Enter your key skills (e.g., React, Node.js, Project Management)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
