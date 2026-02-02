
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: "Aszód - Gyümölcsfa és Virághagyma Igénylés",
    description: "Ingyenes gyümölcsfa és virághagyma igénylés aszódi lakosoknak.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="hu">
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
                {children}
            </body>
        </html>
    );
}
