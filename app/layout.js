import { Inter } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "就活締め切り管理",
  description: "ES・アンケートなど就活の締め切りを一覧・カレンダーで管理",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    // iOS はマニフェストのアイコンを使わず apple-touch-icon を参照する（透明部分は黒くなるため全面塗りの画像）
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "締切管理",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#3B82F6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} min-h-screen bg-page`}>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
