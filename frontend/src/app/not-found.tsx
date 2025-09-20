"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main px-4">
      <img
        src="/images/logozato.png"
        alt="ZatoBox Logo"
        className="w-16 mb-6"
      />
      <h1 className="text-4xl font-bold text-zatobox-900 mb-2">404</h1>
      <p className="text-lg text-black mb-6 font-medium">Page not found</p>
      <Link
        href="/home"
        className="bg-zatobox-500 text-white px-6 py-2 rounded-full font-medium shadow hover:bg-zatobox-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
