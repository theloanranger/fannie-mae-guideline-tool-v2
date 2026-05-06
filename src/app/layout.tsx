import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Empower Home Loan - California",
  description: "Estimate PITI, DTI, LTV, and guideline flags for Fannie Mae Conventional loans in California",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-primary-700 to-primary-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Empower Home Loan
              </h1>
              <p className="text-primary-100 mt-1 text-sm">
                California Mortgage Scenario Calculator
              </p>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">The Santos Lending Team | Empower Home Loans</h3>
              <p className="text-sm text-gray-400 mb-3">Your trusted California mortgage partner</p>
              
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <strong>Guillermo Santos</strong>, NMLS #972977
                </p>
                <p className="text-gray-400">
                  <a href="tel:510-931-9114" className="hover:text-primary-400 transition-colors">
                    📞 (510) 931-9114
                  </a>
                </p>
                <p className="text-gray-400">
                  <a href="mailto:Guillermo@empowermyloan.com" className="hover:text-primary-400 transition-colors">
                    ✉️ Guillermo@empowermyloan.com
                  </a>
                </p>
                <p className="text-gray-400 text-xs mt-3">
                  Bishop Ranch 3, 2603 Camino Ramon, Suite 200<br />
                  San Ramon, CA 94583
                </p>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">
              This is an estimate tool only. Not a loan approval or commitment. 
              Actual loan terms and approval subject to full underwriting review.
              Licensed in California only.
            </p>
            <p className="text-xs text-gray-600 mt-4">
              © {new Date().getFullYear()} Empower Home Loans. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
