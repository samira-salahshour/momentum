import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import "@samira-salahshour/ui/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momentum",
  description: "Build consistency, one day at a time.",
};

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/goals/new", label: "Create goal" },
  { href: "/log", label: "Log today" },
  { href: "/history", label: "History" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <Link className="flex items-center gap-3" href="/">
              <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
                M
              </span>
              <span>
                <span className="block text-base font-bold tracking-tight">
                  Momentum
                </span>
                <span className="block text-xs text-slate-500">
                  Small steps, lasting progress
                </span>
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <ul className="flex flex-wrap gap-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link className="nav-link" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
