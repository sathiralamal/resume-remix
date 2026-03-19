import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Resume Remxi",
  description: "AI-powered resume tailoring. Clean, quiet, precise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
             __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme === 'dark' || (!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${plusJakarta.className} antialiased bg-background text-foreground transition-colors duration-300 min-h-screen selection:bg-muted selection:text-foreground relative`}>
        <ThemeProvider>
          <AuthProvider>
             {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
