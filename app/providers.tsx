"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"   // 👈 default theme
      enableSystem={false}   // 👈 disable OS auto mode (optional)
    >
      {children}
    </ThemeProvider>
  );
}
