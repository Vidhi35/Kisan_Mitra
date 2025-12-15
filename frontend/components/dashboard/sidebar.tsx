"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Camera, MessageSquare, Store, Cloud, FileText, User, Sprout } from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/camera", icon: Camera, label: "Diagnose" },
  { href: "/community", icon: MessageSquare, label: "Community" },
  { href: "/market", icon: Store, label: "Market" },
  { href: "/weather", icon: Cloud, label: "Weather" },
  { href: "/records", icon: FileText, label: "Records" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path
      ? "bg-primary/10 text-primary dark:text-primary"
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"

  return (
    <aside className="hidden md:flex w-64 flex-col bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 h-full">
      <Link href="/dashboard" className="p-6 flex items-center gap-3 cursor-pointer">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <Sprout className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">PlantDoctor</h1>
      </Link>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(item.href)}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
