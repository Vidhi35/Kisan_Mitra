import { getDiagnosisById } from "@/lib/actions/diagnoses"
import { AlertTriangle } from "lucide-react"
import { notFound } from "next/navigation"

export default async function ResultsScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Demo data for demonstration
  const demoData = {
    id: "demo",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1z4-x1cU-zJMNZgWourJ9wlTyj2QxezPhkqa6isvvzcWVi7gJ9kYz4o0I0zq2alDKFHxiXsjNVJgERVbbiTdmZA99mAcFEPyv17yXOO3H6gWlJTTLFx6k2OUby3KuwCTT2vf5bIrBLoV3dsRwnCdoagLFuumC6kqThhZ1HvO9uDz67buLZX0XiJZQm9SL7QL46NEuo91DF_J7Is8dmND9870N-r1gY6dD97ZTQUQW5cgPfL1_u8OSjc1VZtcc6SEo22oNU9ONzPqm",
    disease_name: "Leaf Spot (Fungal)",
    confidence: 87,
    severity: "high",
    symptoms: "Brown circular spots with yellow halos on leaves",
    treatment_recommendation: "Apply fungicide. Remove infected leaves. Improve air circulation.",
    crop_type: "Tomato",
  }

  const diagnosis = id === "demo" ? demoData : (await getDiagnosisById(id)).data

  if (!diagnosis) {
    notFound()
  }

  const severityColor = {
    low: "bg-green-100 dark:bg-green-900/30 text-green-700",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700",
    high: "bg-red-100 dark:bg-red-900/30 text-red-700",
    critical: "bg-red-100 dark:bg-red-900/30 text-danger",
  }[diagnosis.severity || "medium"]

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-6">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-[#e9f2ec] dark:border-[#2a3b30] flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden shadow-md">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${diagnosis.image_url}')` }}
            ></div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full ${severityColor} text-xs font-bold tracking-wider uppercase flex items-center gap-1`}
            >
              <AlertTriangle className="w-4 h-4" /> Disease Detected
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f1a14] dark:text-white mb-2">
            {diagnosis.disease_name}
          </h1>
          <div className="bg-surface-light dark:bg-black/20 rounded-xl p-5 border border-[#e9f2ec] dark:border-[#2a3b30] mt-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Confidence Score</p>
                <p className="text-danger font-bold text-lg">HIGH RISK</p>
              </div>
              <p className="text-danger font-bold text-2xl">{diagnosis.confidence}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="bg-danger h-3 rounded-full" style={{ width: `${diagnosis.confidence}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-[#e9f2ec] dark:border-[#2a3b30]">
        <h3 className="text-lg font-bold text-[#0f1a14] dark:text-white mb-4">Treatment Options</h3>
        <div className="space-y-4">
          <div className="bg-[#f9fbfa] dark:bg-[#1a251e] p-4 rounded-xl border border-[#e9f2ec] dark:border-[#2a3b30]">
            <h4 className="text-lg font-semibold text-[#0f1a14] dark:text-white mb-2">Recommended Treatment</h4>
            <p className="text-gray-600 dark:text-gray-300">{diagnosis.treatment_recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
