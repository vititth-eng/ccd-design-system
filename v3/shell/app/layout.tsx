import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CCD Design — v3 workbench",
  description: "Local inspection surface for design system v3.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* data-theme is a document-level mode, which is what colors.css requires:
       its dark variant matches :root[data-theme="dark"], never a nested class,
       so there is no such thing as a dark island inside a light page. "system"
       defers to the OS; the shell's own toggle will swap this attribute. */
    <html lang="en" data-theme="system">
      <body>{children}</body>
    </html>
  );
}
