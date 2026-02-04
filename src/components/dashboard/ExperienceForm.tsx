interface ExperienceFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ExperienceForm({ value, onChange }: ExperienceFormProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Your Experience
      </label>
      <textarea
        className="w-full h-40 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Paste your resume experience section here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
