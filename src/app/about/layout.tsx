import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Equation Pyramid",
  description:
    "Learn about Equation Pyramid, a math puzzle game inspired by The Devil's Plan. Created with love by Eason & Carol.",
  openGraph: {
    title: "About - Equation Pyramid",
    description:
      "Learn about Equation Pyramid, a math puzzle game inspired by The Devil's Plan.",
  },
  twitter: {
    title: "About - Equation Pyramid",
    description:
      "Learn about Equation Pyramid, a math puzzle game inspired by The Devil's Plan.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
