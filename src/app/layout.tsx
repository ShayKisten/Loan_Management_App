import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import * as React from 'react'; 
import Menu from '@/components/Menu';
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white p-4 flex justify-between items-center h-[10dvh]">
            <div>
              <span className="font-bold text-xl">Loan Management</span>
            </div>
            <div>
              <Menu />
            </div>
          </div>
          <main className="mt-[10dvh] h-[90dvh] overflow-y-scroll">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
