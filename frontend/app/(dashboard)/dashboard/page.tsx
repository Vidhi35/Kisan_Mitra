import { getDiagnoses } from "@/lib/actions/diagnoses"
import Link from "next/link"
import { Camera, History, TrendingUp, BookOpen, ExternalLink } from "lucide-react"

const TOP_SCHEMES = [
  { id: 1, name: "PM-KISAN", desc: "₹6,000/year income support", badge: "Active" },
  { id: 2, name: "PMFBY", desc: "Crop insurance with 90% subsidy", badge: "Apply Now" },
  { id: 3, name: "Copra MSP 2026", desc: "₹12,027/quintal support price", badge: "New" },
  { id: 4, name: "PMKSY", desc: "Irrigation subsidy up to 90%", badge: "Popular" },
  { id: 5, name: "KCC", desc: "Credit at subsidized rates", badge: "Active" },
]

export default async function DashboardScreen() {
  const mockUserId = "00000000-0000-0000-0000-000000000001"
  const userName = "Farmer"

  const diagnosesResult = await getDiagnoses(mockUserId, 5)
  const diagnoses = diagnosesResult.data || []

  return (
    <div className="px-4 md:px-8 pb-8 pt-4 max-w-7xl mx-auto w-full">
      <section className="mb-8 mt-4 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Welcome, {userName}! 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Good Morning. Here's what's happening on your farm today.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/camera"
                className="flex flex-col items-start justify-between p-6 h-40 bg-primary text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all group relative overflow-hidden"
              >
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Diagnose Plant</h3>
                  <p className="text-primary-50 text-sm">Take a photo to detect diseases</p>
                </div>
              </Link>
              <Link
                href="/records"
                className="flex flex-col items-start justify-between p-6 h-40 bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
              >
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                  <History className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    My Records
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">View farm history</p>
                </div>
              </Link>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
              <Link href="/scan-history" className="text-sm font-medium text-primary hover:text-primary-dark">
                View All
              </Link>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Crop Scan</th>
                    <th className="px-6 py-4 font-medium">Disease Detected</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {diagnoses.length > 0 ? (
                    diagnoses.map((diagnosis) => (
                      <tr key={diagnosis.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {diagnosis.crop_type || "Plant"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {diagnosis.disease_name || "None (Healthy)"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/results/${diagnosis.id}`} className="text-primary hover:text-primary-dark">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        No recent scans. Start by diagnosing a plant!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                सरकारी योजनाएं / Government Schemes
              </h2>
              <Link
                href="/schemes"
                className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {TOP_SCHEMES.map((scheme) => (
                  <Link
                    key={scheme.id}
                    href={`/schemes`}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{scheme.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        {scheme.badge}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-800 to-green-900 text-white p-6">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Farming Tip of the Day</h3>
                <p className="text-green-100 text-sm mb-4">
                  Rotate crops annually to maintain soil nutrients and reduce pest buildup.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
