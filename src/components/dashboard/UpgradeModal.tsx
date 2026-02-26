"use client";

import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
}

export default function UpgradeModal({ isOpen, onClose, limit }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl dark:shadow-gray-800/50 p-8 max-w-md w-full mx-4 text-center transform transition-all scale-100">
        <div className="mb-4 text-4xl">🚀</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Limit Reached</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You've used all {limit} of your free remixes. Upgrade to Pro for unlimited AI-powered resumes.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/upgrade"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
             Unlock Unlimited Access
          </Link>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
