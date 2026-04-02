import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#f7f8f4]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1380px] px-6 py-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
