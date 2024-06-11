import type { Metadata } from "next";
import { Inter, League_Spartan } from "next/font/google";
import "./globals.css";
import Footer from "@components/Footer"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});
const leaguespartan = League_Spartan({ 
  subsets: ["latin"],
  variable: '--font-league-spartan',
});

export const metadata: Metadata = {
  title: "echo. | Chat with your docs",
  description: "created by tasmay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${leaguespartan.variable} ${inter.variable} font-sans`}>
        <div className="w-full max-w-full h-screen flex flex-col items-center justify-end">
            {children}
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
