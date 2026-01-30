import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export default function NotFound() {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 px-4 ${playfair.variable}`}>
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-serif font-bold text-[#800000] mb-4">404</h1>
        <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#800000] text-white font-serif font-semibold rounded-lg hover:bg-[#600000] transition-colors cursor-pointer"
          >
            Go Home
          </Link>
          <Link
            href="/artworks"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-serif font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Browse Artworks
          </Link>
        </div>
      </div>
    </div>
  );
}
