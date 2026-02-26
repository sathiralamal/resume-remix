interface JobDescriptionFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionForm({ value, onChange }: JobDescriptionFormProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Target Job Description
      </label>
      <textarea
        className="w-full h-40 p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        placeholder="Paste the job description you are applying for..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
