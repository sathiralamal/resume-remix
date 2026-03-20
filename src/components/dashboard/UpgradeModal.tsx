"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
}

export default function UpgradeModal({ isOpen, onClose, limit }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="glass-panel p-8 max-w-md w-full rounded-2xl relative bg-card">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-center mb-2 tracking-tight">Usage Limit Reached</h2>
        
        <div className="text-center text-muted-foreground text-sm mb-8 leading-relaxed">
          You've reached your free limit of {limit} tailoring sessions. Upgrade to Pro for unlimited access and priority processing.
        </div>
        
        <div className="space-y-3">
          <Link
            href="/upgrade"
            className="flex items-center justify-center w-full py-3.5 bg-primary text-primary-foreground font-medium rounded-xl btn-hover btn-active transition-all"
          >
             Upgrade to Pro
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3.5 text-foreground font-medium rounded-xl border border-border/50 hover:bg-muted transition-colors"
          >
            Not right now
          </button>
        </div>
      </div>
    </div>
  );
}
