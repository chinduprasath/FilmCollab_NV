import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProvider } from "@/components/providers/supabase-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FilmCollab - Professional Networking & Collaboration Platform",
    template: "%s | FilmCollab",
  },
  description: "Connect with industry professionals, discover opportunities, and collaborate on film projects. The premier networking platform for the film and entertainment industry.",
  keywords: [
    "film",
    "entertainment",
    "networking",
    "collaboration",
    "actors",
    "directors",
    "producers",
    "writers",
    "editors",
    "crew",
    "jobs",
    "auditions",
    "projects",
    "events",
    "workshops",
  ],
  authors: [{ name: "FilmCollab Team" }],
  creator: "FilmCollab",
  publisher: "FilmCollab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FilmCollab - Professional Networking & Collaboration Platform",
    description: "Connect with industry professionals, discover opportunities, and collaborate on film projects.",
    siteName: "FilmCollab",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FilmCollab - Professional Networking & Collaboration Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FilmCollab - Professional Networking & Collaboration Platform",
    description: "Connect with industry professionals, discover opportunities, and collaborate on film projects.",
    images: ["/og-image.jpg"],
    creator: "@filmcollab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            {children}
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
