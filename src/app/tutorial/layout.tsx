import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorial - Equation Pyramid",
  description: "Learn how to play Equation Pyramid with an interactive tutorial. Master the basics of forming equations using number tiles to reach target values.",
  openGraph: {
    title: "Tutorial - Equation Pyramid",
    description: "Learn how to play Equation Pyramid with an interactive tutorial. Master the basics of forming equations using number tiles.",
  },
  twitter: {
    title: "Tutorial - Equation Pyramid",
    description: "Learn how to play Equation Pyramid with an interactive tutorial. Master the basics of forming equations using number tiles.",
  },
};

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}