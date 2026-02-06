import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry"; // 引入剛剛做的
import { ThemeModeProvider } from "@/app/ThemeContext";

export const metadata: Metadata = {
  title: "GrooveLog",
  description: "練琴日記",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body suppressHydrationWarning={true}>
        <ThemeModeProvider>
          <ThemeRegistry>
            {/* 這裡加個 Box 讓全域置中，跟之前 App.tsx 一樣 */}
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
              {children}
            </div>
          </ThemeRegistry>
        </ThemeModeProvider>
      </body>
    </html>
  );
}