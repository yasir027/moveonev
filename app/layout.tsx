import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { GlassFilter } from "@/components/ui/GlassFilter";
import { GlassLens } from "@/components/ui/GlassLens";
import { BrandLoader } from "@/components/loader/BrandLoader";
import { RouteTransition } from "@/components/loader/RouteTransition";
import { LOADER_BOOT_SCRIPT } from "@/lib/intro/loader";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-loader is set by the boot script before hydration
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: LOADER_BOOT_SCRIPT }} />
        <BrandLoader />
        <GlassFilter />
        {/* One cursor lens for the whole site. GlassFilter above it is not optional:
            it sets html[data-liquid], which is what switches .glass-lens from a plain
            blur to the refracting backdrop filter. */}
        <GlassLens />
        {/* The header lives in the layout so it stays put between pages. */}
        <RouteTransition header={<Navbar />}>{children}</RouteTransition>
      </body>
    </html>
  );
}
