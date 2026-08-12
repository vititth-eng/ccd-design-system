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
      <head>
        {/* The exact request tokens.css documents, character for character, and the
            same one every v3/explore page uses — so what renders here is what was
            measured there. tokens.css can only NAME the families; a CSS variable
            never fetches a font, so a shell that skips this link renders in
            whatever happens to be installed on the machine and nothing errors.
            It did exactly that until 2026-08-12: Inter resolved to a local copy
            and Thai fell through to the macOS default, which is not Noto.

            The axes are the reason the URL looks like this. Ask for a plain
            weight list and the browser gets static instances, so the variable
            file buys nothing and the four weights in tokens.css stop being free.
            opsz is Latin-only — Noto Sans Thai carries no such axis. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Noto+Sans+Thai:wght@100..900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
