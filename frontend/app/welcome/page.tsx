"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WelcomeScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login")
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#dcfce7] to-[#f6f8f7] dark:from-[#1a2e22] dark:to-background-dark">
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4 z-10">
        <div className="w-[120px] h-[120px] bg-white dark:bg-[#1e2e24] rounded-full shadow-xl flex items-center justify-center mb-8 p-5 animate-pulse ring-4 ring-primary/10">
          <img
            alt="PlantDoctor App Logo"
            className="w-full h-full object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6FHuPR-r6cosk-guBrLMRbPPZe7LIJOlfL6FwlzAIbA_B5fkaCk8-yVvR4nsKlrgt5PRbrFpnLIAS7RTo6fgZnjGF7wY1YQnLukPVcxgMpuWXdwhX_FRFC8fPzFaYPEBpNYKOjtoGc1wqr47Iv8YEwg_92nSKi911CrU9Eey695ooSk7L0tr_NiB81pQfJvDUjaRG2Hp2QlTcrIpiY3M_3IeHTZZ2hmaGJtZTyzy2kNsk_7Cy-5Sir3m1umSmiZB8CQRpwaCULuzi"
          />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-[#0f1a14] dark:text-white text-[32px] font-bold leading-tight tracking-tight mb-3 drop-shadow-sm">
            PlantDoctor
          </h1>
          <h2 className="text-[#6b7280] dark:text-gray-400 text-sm font-medium tracking-wide">
            Your Plant's Health Expert
          </h2>
        </div>
        <div className="absolute bottom-12 flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-primary font-medium text-sm animate-pulse tracking-wider">Loading...</p>
        </div>
      </div>
    </div>
  )
}
