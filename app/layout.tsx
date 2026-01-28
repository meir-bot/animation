import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LaborRx Product Overview",
  description: "Healthcare staffing made simple - Product overview video",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
