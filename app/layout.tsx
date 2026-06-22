export const metadata = {
  title: "WiseCard — Save More on Every Card Spend",
  description: "WiseCard helps you save money on every credit card purchase. Get AI-powered advice on which card to use, track rewards, and minimize interest automatically.",
  keywords: "credit card optimizer, rewards maximizer, credit score, points, cashback, financial advisor",
  authors: [{ name: "WiseCard" }],
  metadataBase: new URL("https://ist-495.vercel.app"),
  openGraph: {
    title: "WiseCard",
    description: "AI-powered credit card optimization",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "WiseCard",
    description: "AI-powered credit card optimization",
  },
};

export const viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta name="application-name" content="WiseCard"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="WiseCard"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="format-detection" content="telephone=no"/>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      </head>
      <body style={{margin:0,padding:0,WebkitFontSmoothing:"antialiased"}}>
        {children}
      </body>
    </html>
  );
}
