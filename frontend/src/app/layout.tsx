import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { PlansProvider } from "@/context/PlansContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CasperFlow | On-Chain Subscriptions & Metered Billing",
  description:
    "The first protocol enabling usage-based billing, stake-powered payments, and cross-chain settlement on the Casper blockchain.",
  keywords: [
    "Casper",
    "blockchain",
    "subscriptions",
    "billing",
    "Web3",
    "DeFi",
    "liquid staking",
    "cross-chain",
  ],
  authors: [{ name: "CasperFlow Team" }],
  openGraph: {
    title: "CasperFlow | On-Chain Subscriptions & Metered Billing",
    description:
      "The first protocol enabling usage-based billing, stake-powered payments, and cross-chain settlement on the Casper blockchain.",
    type: "website",
    locale: "en_US",
    siteName: "CasperFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "CasperFlow | On-Chain Subscriptions & Metered Billing",
    description:
      "The first protocol enabling usage-based billing, stake-powered payments, and cross-chain settlement on the Casper blockchain.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>
          <NotificationsProvider>
            <SubscriptionsProvider>
              <PlansProvider>
                {children}
              </PlansProvider>
            </SubscriptionsProvider>
          </NotificationsProvider>
        </WalletProvider>
      </body>
    </html>
  );
}

