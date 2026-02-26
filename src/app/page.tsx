import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Resume <span className="text-blue-600 dark:text-blue-400">Remxi</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Tailor your resume to any job description in seconds using advanced AI.
          Stop guessing keywords and start getting interviews.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
