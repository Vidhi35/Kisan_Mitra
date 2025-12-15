import Link from "next/link"
import { Bell, Sprout } from "lucide-react"

export function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <Sprout className="w-5 h-5 text-primary" />
        <span className="font-bold text-lg dark:text-white">PlantDoctor</span>
      </div>
      <div className="flex gap-2">
        <Link
          href="/notifications"
          className="p-2 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Bell className="w-5 h-5" />
        </Link>
      </div>
    </header>
  )
}
