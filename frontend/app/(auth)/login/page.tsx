"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ChevronDown } from "lucide-react"

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("farmer@example.com")
  const [password, setPassword] = useState("password")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signIn(email, password)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden min-h-screen bg-background-light dark:bg-background-dark">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#2ecc70 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>
      <div className="relative w-full max-w-[480px] bg-white dark:bg-[#1e2a23] rounded-xl shadow-lg border border-[#e9f2ec] dark:border-gray-700 p-6 sm:p-10 z-10 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-[#0f1a14] dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-[#568f6e] dark:text-gray-400 text-sm font-normal">
            Please login to access market rates and crop doctor.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-[#0f1a14] dark:text-gray-200 text-sm font-medium">Phone Number / Email</Label>
            <div className="flex gap-3">
              <div className="relative w-[80px]">
                <select className="w-full h-12 rounded-lg border border-[#d2e4da] dark:border-gray-600 bg-background-light dark:bg-background-dark text-[#0f1a14] dark:text-white px-2 appearance-none focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm font-medium cursor-pointer">
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-4 h-4" />
              </div>
              <Input
                className="flex-1 h-12 rounded-lg border border-[#d2e4da] dark:border-gray-600 bg-background-light dark:bg-background-dark"
                placeholder="Enter phone or email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[#0f1a14] dark:text-gray-200 text-sm font-medium">Password</Label>
            <div className="relative">
              <Input
                className="w-full h-12 rounded-lg border border-[#d2e4da] dark:border-gray-600 bg-background-light dark:bg-background-dark pr-12"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#568f6e] hover:text-primary transition-colors flex items-center justify-center"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <Checkbox className="w-5 h-5" />
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-[#0f1a14] dark:group-hover:text-white transition-colors">
                Remember Me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-green-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            className="w-full h-12 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all uppercase tracking-wide mt-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-xs font-medium uppercase">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full h-11 bg-white dark:bg-gray-800 border border-[#d2e4da] dark:border-gray-600 rounded-lg"
          >
            <span className="text-gray-600 dark:text-gray-400 mr-3">📱</span>
            Sign up with Phone OTP
          </Button>
        </div>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
