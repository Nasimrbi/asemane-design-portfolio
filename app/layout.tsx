import type { Metadata } from 'next';
import './globals.css'; // Make sure this matches your file name (globals.css or global.css)

export const metadata: Metadata = {
  title: 'portfolio',
  description: "asmeane's portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased m-0 p-0">{children}</body>
    </html>
  );
}