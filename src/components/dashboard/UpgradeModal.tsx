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
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center transform transition-all scale-100">
        <div className="mb-4 text-4xl">🚀</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Limit Reached</h2>
        <p className="text-gray-600 mb-6">
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
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
