import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Staff Spectrum | HR Solution in Kerala",
  description: "Providing High Performing Staffing Solutions",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import SafeDomPatch from "../components/SafeDomPatch";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className={outfit.variable} suppressHydrationWarning>
        <SafeDomPatch />
        {children}
      </body>
    </html>
  );
}
