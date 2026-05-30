"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gem,
  LayoutDashboard,
  Users,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Shield,
  UserCog,
  Grid3X3,
  FileDown,
  ScanLine,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: Record<string, NavItem[]> = {
  superadmin: [
    { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/superadmin/admins", label: "Admin Management", icon: Users },
    { href: "/superadmin/audit-logs", label: "Audit Logs", icon: ScrollText },
    { href: "/superadmin/settings", label: "System Settings", icon: Settings },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/employees", label: "Employees", icon: UserCog },
    { href: "/admin/permissions", label: "Permissions", icon: Grid3X3 },
    { href: "/admin/diamonds", label: "Diamonds", icon: Diamond },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    { href: "/admin/export", label: "Export Center", icon: FileDown },
  ],
  employee: [
    { href: "/employee", label: "Dashboard", icon: LayoutDashboard },
    { href: "/employee/scan", label: "Barcode Scanner", icon: ScanLine },
    { href: "/employee/profile", label: "My Profile", icon: User },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "superadmin" | "admin" | "employee";
  user?: {
    fullName: string;
    email: string;
    role: string;
    profilePhoto?: string | null;
    permittedStages?: number[];
  };
}

export default function DashboardLayout({
  children,
  role,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const items = (navItems[role] || []).filter(item => {
    if (item.label === "Barcode Scanner" && role === "employee") {
      return user?.permittedStages?.includes(4);
    }
    return true;
  });

  const roleColor = {
    superadmin: "text-destructive",
    admin: "text-royal-blue",
    employee: "text-success",
  }[role];

  const roleBadge = {
    superadmin: "Super Admin",
    admin: "Admin",
    employee: "Employee",
  }[role];

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-navy-deep/95 backdrop-blur-sm transition-all duration-300 ${sidebarOpen ? "w-[280px]" : "w-[72px]"
          }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-sky-blue" />
              <span className="font-display text-lg font-bold">
                TRACE<span className="text-sky-blue">ON</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-royal-blue/10 text-muted hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== `/${role}` && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                    ? "bg-royal-blue/15 text-white font-medium border-l-2 border-royal-blue"
                    : "text-muted hover:text-white hover:bg-royal-blue/5"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={18} className={isActive ? "text-royal-blue" : ""} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-royal-blue/20 flex items-center justify-center text-sm font-semibold text-royal-blue">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.fullName || "User"}
                </p>
                <p className={`text-xs ${roleColor}`}>{roleBadge}</p>
              </div>
              <Link
                href="/api/auth/logout"
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted hover:text-destructive transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-royal-blue/20 flex items-center justify-center text-sm font-semibold text-royal-blue">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-navy-deep/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-royal-blue/10 text-muted"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search diamonds, employees..."
                className="w-full glass-input h-9 pl-9 pr-4 text-sm rounded-lg"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-royal-blue/10 text-muted hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>

            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-royal-blue/20 flex items-center justify-center text-xs font-semibold text-royal-blue">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-navy-deep border-r border-border z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                  <Gem className="w-6 h-6 text-sky-blue" />
                  <span className="font-display text-lg font-bold">
                    TRACE<span className="text-sky-blue">ON</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-royal-blue/10 text-muted"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                          ? "bg-royal-blue/15 text-white font-medium"
                          : "text-muted hover:text-white hover:bg-royal-blue/5"
                        }`}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
