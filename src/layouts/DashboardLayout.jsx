import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import BreadCrumb from '../components/layout/BreadCrumb';
import Footer from '../components/layout/Footer';
import CommandPalette from '../components/common/CommandPalette';
import ScrollToTop from '../components/common/ScrollToTop';
import FloatingSupport from '../components/common/FloatingSupport';
import { SidebarContext } from '../contexts/SidebarContext';

export default function DashboardLayout() {
  const { isOpen, isMobileOpen, closeMobileSidebar } = useContext(SidebarContext);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 selection:bg-primary-500 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity animate-fade-in"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <Topbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in flex flex-col justify-between">
          <div className="space-y-6">
            <BreadCrumb />
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* Global Interactive Elements */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <ScrollToTop />
      <FloatingSupport />
    </div>
  );
}
