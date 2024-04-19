
import { Inter as FontSans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { TopNav } from "~/components/top-nav";
import { api } from "~/trpc/server";
import { ThemeProvider } from "next-themes";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";
import { captureRejectionSymbol } from "events";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <TopNav />
          <Toaster />
          <TRPCReactProvider>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
