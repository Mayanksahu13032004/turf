"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import TurfFooter from "./turfFooter";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <TurfFooter />}
    </>
  );
}
