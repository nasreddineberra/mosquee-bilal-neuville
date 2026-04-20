import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import LayoutShell from "@/components/LayoutShell";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Mosquée Bilal - Neuville-sur-Saône",
  description: "Un sanctuaire de sérénité, de savoir et de fraternité au cœur de Neuville-sur-Saône.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className="font-sans"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
