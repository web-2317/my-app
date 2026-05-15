import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "就活締め切り管理",
  description: "ES・アンケートなど就活の締め切りを一覧・カレンダーで管理",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    title: "締切管理",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen bg-page`}>
        {children}
      </body>
    </html>
  );
}
