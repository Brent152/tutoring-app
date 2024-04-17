import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { TopNav } from "~/components/top-nav";
import { api } from "~/trpc/server";
import { ThemeProvider } from "next-themes";
import { cn } from "~/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Tutoring App",
  description: "ChatGPT Tutoring Prototype.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await api.user.getAll();

  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col gap-4", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <TopNav />
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
