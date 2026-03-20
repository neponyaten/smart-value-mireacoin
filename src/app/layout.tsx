import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MireaCoin | Гейфикация активности студентов",
  description: "Цифровая платформа для отслеживания активности студентов с системой внутренних наград.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%2300F0FF' font-family='system-ui' font-weight='bold'>Ⓜ</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
