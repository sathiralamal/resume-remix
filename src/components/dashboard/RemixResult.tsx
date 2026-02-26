import { RemixResult as RemixResultType } from "@/types";

interface RemixResultProps {
  data: RemixResultType;
}

export default function RemixResult({ data }: RemixResultProps) {
  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mt-8 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-2">Result</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-blue-700 dark:text-blue-400">Remixed Experience</h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 whitespace-pre-wrap text-sm leading-relaxed dark:text-gray-200">
          {data.remixedExperience}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-blue-700 dark:text-blue-400">Remixed Skills</h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 whitespace-pre-wrap text-sm leading-relaxed dark:text-gray-200">
          {data.remixedSkills}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-green-700 dark:text-green-400">💡 Custom Tips</h3>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded border border-green-200 dark:border-green-800 text-sm text-green-900 dark:text-green-200 leading-relaxed whitespace-pre-wrap">
          {data.tips}
        </div>
      </div>
    </div>
  );
}
