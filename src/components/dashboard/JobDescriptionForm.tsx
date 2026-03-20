interface JobDescriptionFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionForm({ value, onChange }: JobDescriptionFormProps) {
  return (
    <div className="space-y-2 animate-fade-in-up delay-100">
      <label className="block text-sm font-medium text-foreground">
        Target Job Description
      </label>
      <textarea
        className="w-full h-40 p-4 clean-input rounded-xl text-foreground placeholder-muted-foreground resize-none leading-relaxed"
        placeholder="Paste the job description you are aiming for..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
