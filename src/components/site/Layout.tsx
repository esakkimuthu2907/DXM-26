import type { ReactNode } from "react";
import { SiteNavbar } from "./SiteNavbar";
import { MechBackdrop } from "./MechBackdrop";
import { Chatbot } from "./Chatbot";


export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <MechBackdrop />
      <SiteNavbar />
      <main className="flex-1 w-full min-w-0 relative z-10 pt-16">

        {children}
      </main>
      <Chatbot />
    </div>
  );
}

