interface SkillsFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SkillsForm({ value, onChange }: SkillsFormProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Your Skills
      </label>
      <textarea
        className="w-full h-24 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        placeholder="List your key skills here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
