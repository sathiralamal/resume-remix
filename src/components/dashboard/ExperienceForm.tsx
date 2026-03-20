interface ExperienceFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ExperienceForm({ value, onChange }: ExperienceFormProps) {
  return (
    <div className="space-y-2 animate-fade-in-up">
      <label className="block text-sm font-medium text-foreground">
        Your Experience
      </label>
      <textarea
        className="w-full h-48 lg:h-[420px] p-4 clean-input rounded-xl text-foreground placeholder-muted-foreground resize-none leading-relaxed"
        placeholder="Paste your current resume experience here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
