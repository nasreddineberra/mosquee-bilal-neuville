import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["400", "700"],
  display: "swap",
});

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
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSerif.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="pt-20">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
