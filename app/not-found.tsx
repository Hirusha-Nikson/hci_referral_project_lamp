"Use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-6">
      <h1 className="text-6xl font-bold text-sky-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-2xl shadow hover:bg-sky-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back home
      </Link>
    </div>
  );
}
