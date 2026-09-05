import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions – Resume Remxi",
  description: "Terms and conditions governing your use of Resume Remxi.",
};

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in-up">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: September 2026
        </p>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Resume Remxi ("Service"), you agree to be
              bound by these Terms &amp; Conditions. If you do not agree, please
              do not use the Service. We reserve the right to update these terms
              at any time; continued use of the Service after changes constitutes
              your acceptance of the revised terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Resume Remxi is an AI-powered tool that helps you tailor your
              resume to specific job descriptions. The Service is provided on an
              "as is" and "as available" basis. We do not guarantee that the
              tailored output will result in employment or interview success.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              3. Eligibility
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 16 years old to use the Service. By using
              Resume Remxi you represent that you meet this requirement and that
              all information you provide is accurate and truthful.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              4. Accounts
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity that occurs under your
              account. Notify us immediately if you suspect any unauthorised use
              of your account. We reserve the right to suspend or terminate
              accounts that violate these terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              5. Payments &amp; Subscriptions
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Pro plan is available for a one-time payment of $12 USD,
              processed securely by LemonSqueezy. All payments are
              non-refundable except where required by applicable law. You will
              receive an email receipt confirming your purchase. We reserve the
              right to change pricing with reasonable notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              6. Acceptable Use
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
              <li>
                Submit false, misleading, or fabricated resume content
              </li>
              <li>
                Attempt to bypass, manipulate, or abuse the AI processing
                system
              </li>
              <li>
                Use the Service for any illegal or unauthorised purpose
              </li>
              <li>
                Reverse-engineer, scrape, or reproduce any part of the Service
                without permission
              </li>
              <li>
                Attempt to gain unauthorised access to other users' data or our
                infrastructure
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              7. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, design, and code comprising the Service is the
              exclusive property of Resume Remxi and is protected by applicable
              intellectual property laws. You retain ownership of the resume
              content you submit; by using the Service you grant us a limited
              licence to process that content solely to provide the tailoring
              functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided without warranties of any kind, whether
              express or implied, including but not limited to implied warranties
              of merchantability, fitness for a particular purpose, or
              non-infringement. We do not warrant that the Service will be
              error-free, uninterrupted, or free of harmful components.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              9. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Resume Remxi and its
              operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising out of or
              related to your use of the Service, even if advised of the
              possibility of such damages. Our total liability to you for any
              claim shall not exceed the amount you paid for the Service in the
              12 months preceding the claim.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              10. Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your access to the
              Service at any time, with or without cause, with or without
              notice. Upon termination, your right to use the Service ceases
              immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              11. Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by and construed in accordance with
              applicable law. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the relevant courts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              12. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms &amp; Conditions,
              please reach out through our{" "}
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
