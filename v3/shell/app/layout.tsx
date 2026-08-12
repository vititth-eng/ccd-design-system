import type { Metadata } from "next";
import Script from "next/script";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Chrome from "./_workbench/chrome";

/* Runs before the browser paints, which is the only place it can run. Read the
   stored mode in an effect instead and the first frame is drawn in the default
   mode, then repainted — the white flash on every load of a dark workbench.
   It writes the same attribute the toggle writes, so there is one mechanism,
   not two. */
const THEME_SCRIPT = `try{var t=localStorage.getItem("ccd-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: "CCD Design — v3 workbench",
  description: "Local inspection surface for design system v3.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* data-theme is a document-level mode, which is what theme.css requires:
       its dark variant matches :root[data-theme="dark"], never a nested class,
       so there is no such thing as a dark island inside a light page. "system"
       defers to the OS; the shell's own toggle will swap this attribute. */
    /* suppressHydrationWarning is correct here and nowhere else in this app: the
       server cannot know the stored mode, so it always sends "system" and the
       pre-paint script overwrites it before React looks. React would otherwise
       report the difference it was told to expect. It suppresses the warning for
       THIS element's attributes only, not for the tree below it. */
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <head>
        {/* The exact request type.css documents, character for character, and the
            same one every v3/explore page uses — so what renders here is what was
            measured there. type.css can only NAME the families; a CSS variable
            never fetches a font, so a shell that skips this link renders in
            whatever happens to be installed on the machine and nothing errors.
            It did exactly that until 2026-08-12: Inter resolved to a local copy
            and Thai fell through to the macOS default, which is not Noto.

            The axes are the reason the URL looks like this. Ask for a plain
            weight list and the browser gets static instances, so the variable
            file buys nothing and the four weights in type.css stop being free.
            opsz is Latin-only — Noto Sans Thai carries no such axis. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Noto+Sans+Thai:wght@100..900&display=swap"
        />
        {/* next/script rather than a bare <script>: React re-renders this tree on
            every client navigation, and a raw inline script in it warns because a
            script rendered on the client never executes. beforeInteractive puts it
            in the initial HTML once, ahead of hydration, which is the only moment
            it needs to run. */}
        <Script id="ccd-theme" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
      </head>
      <body>
        {/* Chrome reads the query string, and useSearchParams needs a Suspense
            boundary above it or the whole route opts out of static rendering. */}
        <Suspense>
          <Chrome>{children}</Chrome>
        </Suspense>
      </body>
    </html>
  );
}
