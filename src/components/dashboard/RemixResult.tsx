import { RemixResult as RemixResultType } from "@/types";

interface RemixResultProps {
  data: RemixResultType;
}

export default function RemixResult({ data }: RemixResultProps) {
  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Result</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-blue-700">Remixed Experience</h3>
        <div className="bg-white p-4 rounded border whitespace-pre-wrap text-sm leading-relaxed">
          {data.remixedExperience}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-blue-700">Remixed Skills</h3>
        <div className="bg-white p-4 rounded border whitespace-pre-wrap text-sm leading-relaxed">
          {data.remixedSkills}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-green-700">💡 Custom Tips</h3>
        <div className="bg-green-50 p-4 rounded border border-green-200 text-sm text-green-900 leading-relaxed whitespace-pre-wrap">
          {data.tips}
        </div>
      </div>
    </div>
  );
}
