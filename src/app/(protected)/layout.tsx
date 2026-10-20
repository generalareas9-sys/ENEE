import type { ReactNode } from "react";
import { PageMotion } from "@/components/page-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader protectedArea />
      <PageMotion>{children}</PageMotion>
      <SiteFooter />
    </>
  );
}
