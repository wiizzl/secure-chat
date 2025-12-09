import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import { Providers } from "@/components/providers";

import { env } from "@/lib/env";

const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "private_chat",
  alternates: {
    canonical: "/",
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout(props: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`antialiased ${jetbrainsMono.className}`}>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
