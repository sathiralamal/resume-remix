import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import PublicLayout from "@/components/shared/PublicLayout";

export const metadata: Metadata = {
  title: "Contact – Resume Remxi",
  description: "Get in touch with the Resume Remxi team.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-6 py-16 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Have a question, suggestion, or issue? We'd love to hear from you.
          </p>
        </div>

        {/* Contact card */}
        <div className="glass-panel rounded-2xl p-8 space-y-8 soft-shadow">
          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Email</div>
              <a
                href="mailto:hello@resumeremxi.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                hello@resumeremxi.com
              </a>
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Support note */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="font-medium text-foreground">Response Time</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We aim to respond within 1–2 business days. For account or
                billing issues, please include your registered email address in
                your message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
