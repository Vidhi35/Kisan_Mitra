"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
    })

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <div className="flex flex-1 w-full h-full">
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            alt="Farming field"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUbQYR4sMZ8hxv1ru1GW26ai738hbnSk0zsi5REhdBxSGKSCMf7hoKT0kla8v3QddlZmhCc5H6mCMqOSM8u4i_R_lFDkgIFqgQ74kfWVpoSr6UF5_SNTOci1jb1Tp5eyEcQDlGVH182KPuzJvZambXv9bZl5L8HFPVKTcNipWex_3gyDgRfafatHhDkWXvLzVoIqFx5HZEt7iTk0j-QG7L1PdevgRNDtKMJE7jZdTNxtrBDoEDr8koONkrL8-YjTnH9J5BsCxIAn-i"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24 bg-white dark:bg-background-dark">
          <div className="max-w-lg w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">Join our Farming Community</h1>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label className="block text-sm font-medium text-text-main dark:text-gray-200">Full Name</Label>
                <Input
                  className="block w-full rounded-lg py-3 px-4"
                  placeholder="e.g. Amit Singh"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="block text-sm font-medium text-text-main dark:text-gray-200">Phone Number</Label>
                <Input
                  className="block w-full rounded-lg py-3 px-4"
                  placeholder="98765 43210"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="block text-sm font-medium text-text-main dark:text-gray-200">Email</Label>
                <Input
                  className="block w-full rounded-lg py-3 px-4"
                  placeholder="amit@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="block text-sm font-medium text-text-main dark:text-gray-200">Password</Label>
                <Input
                  className="block w-full rounded-lg py-3 px-4"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button
                className="w-full flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-base py-3.5 px-6 shadow-md mt-6"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "REGISTERING..." : "REGISTER"}
              </Button>
              <p className="text-center text-sm text-text-main dark:text-gray-300 pt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:text-primary-dark underline">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
