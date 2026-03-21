import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";

export const metadata: Metadata = {
  title: "Privacy Policy – Resume Remxi",
  description: "How Resume Remxi collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in-up">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: March 2026
        </p>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Resume Remxi ("we", "us", or "our") operates the Resume Remxi
              service. This Privacy Policy explains how we collect, use, and
              protect your personal information when you use our website and
              services. By using Resume Remxi, you agree to the collection and
              use of information as described in this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              2. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information you provide directly to us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
              <li>
                <strong className="text-foreground">Account information</strong>{" "}
                — your name and email address when you register
              </li>
              <li>
                <strong className="text-foreground">Resume content</strong> —
                the work experience, skills, and job descriptions you submit for
                tailoring
              </li>
              <li>
                <strong className="text-foreground">Usage data</strong> —
                information about how you interact with our service, such as
                feature usage and session data
              </li>
              <li>
                <strong className="text-foreground">Payment information</strong>{" "}
                — handled entirely by our payment processor; we do not store
                card details
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
              <li>Provide, operate, and improve the Resume Remxi service</li>
              <li>
                Process your resume tailoring requests through AI analysis
              </li>
              <li>
                Send transactional emails (account confirmation, password reset)
              </li>
              <li>Manage your subscription and billing</li>
              <li>
                Respond to your inquiries and provide customer support
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              4. AI Processing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To tailor your resume, the experience and job description text you
              submit is sent to a third-party AI provider for processing. This
              data is transmitted securely and is not used to train AI models.
              We do not store your resume content on third-party servers beyond
              the duration of a single request.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              5. Third-Party Services
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services in operating Resume
              Remxi:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
              <li>
                <strong className="text-foreground">Authentication</strong> —
                NextAuth.js for secure session management
              </li>
              <li>
                <strong className="text-foreground">Payments</strong> —
                LemonSqueezy for subscription billing
              </li>
              <li>
                <strong className="text-foreground">AI</strong> — a third-party
                AI API provider for resume analysis
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Each provider has their own privacy policy governing how they
              handle data shared with them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              6. Data Storage and Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your account data is stored in an encrypted database. Passwords
              are hashed and never stored in plain text. We use
              industry-standard security practices to protect your information,
              though no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              7. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your account information for as long as your account is
              active. If you request account deletion, we will remove your
              personal data from our systems within 30 days, except where
              retention is required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal
              data. To exercise these rights, please contact us via our{" "}
              <a
                href="/contact"
                className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                Contact page
              </a>
              . We will respond to your request within a reasonable timeframe.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              9. Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use session cookies solely to maintain your authenticated
              session. We do not use tracking cookies, advertising cookies, or
              third-party analytics cookies. You can disable cookies in your
              browser settings, though this will prevent you from staying logged
              in.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              10. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by updating the "Last updated"
              date at the top of this page. Continued use of Resume Remxi after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              11. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please reach
              out through our{" "}
              <a
                href="/contact"
                className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                Contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
