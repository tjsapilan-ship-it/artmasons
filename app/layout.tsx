import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./watermark-overrides.css";
import PageLoader from "./components/PageLoader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Art Masons",
  description: "Museum-Quality Oil Painting Reproductions - Hand-Painted by Master Artists",
  keywords: "oil paintings, art reproductions, hand-painted art, museum quality art, famous paintings, art gallery",
  authors: [{ name: "Art Masons" }],
  openGraph: {
    title: "Art Masons - Museum-Quality Art Reproductions",
    description: "Hand-painted oil painting reproductions by master artists. Museum-quality craftsmanship.",
    type: "website",
    locale: "en_US",
    siteName: "Art Masons",
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Masons - Museum-Quality Art Reproductions",
    description: "Hand-painted oil painting reproductions by master artists",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/artmasons_logo.webp',
    apple: '/artmasons_logo.webp',
    shortcut: '/artmasons_logo.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        <PageLoader />
        <ErrorBoundary>
          <ToastProvider>
            <CartProvider>
              <Header />
              {children}
              <BackToTop />
              <Footer />
            </CartProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
