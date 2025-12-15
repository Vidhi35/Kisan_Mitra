"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Save, X, LogOut, Camera, MapPin, Phone, User, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ scans: 0, posts: 0, records: 0 })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    farm_size: 0,
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${MOCK_USER_ID}`)
      const data = await res.json()

      if (data.profile) {
        setProfile(data.profile)
        setFormData({
          full_name: data.profile.full_name || "",
          phone: data.profile.phone || "",
          location: data.profile.location || "",
          farm_size: data.profile.farm_size || 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/profile/stats?userId=${MOCK_USER_ID}`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: MOCK_USER_ID, ...formData }),
      })

      const data = await res.json()

      if (data.success) {
        setProfile(data.profile)
        setEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      farm_size: profile?.farm_size || 0,
    })
    setEditing(false)
  }

  const handleLogout = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 pb-24">
      {/* Profile Header Card */}
      <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Profile Photo */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={formData.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                {formData.full_name?.[0] || "F"}
              </AvatarFallback>
            </Avatar>
            {editing && (
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-1"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone" className="text-sm">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-1"
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="farm_size" className="text-sm">
                    Farm Size (Acres)
                  </Label>
                  <Input
                    id="farm_size"
                    type="number"
                    value={formData.farm_size}
                    onChange={(e) => setFormData({ ...formData, farm_size: Number.parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {profile?.full_name || "Farmer"}
                </h3>
                <div className="flex flex-col gap-1 text-slate-600 dark:text-slate-400">
                  {profile?.phone && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.farm_size > 0 && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <TrendingUp className="w-4 h-4" />
                      <span>{profile.farm_size} Acres</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave} className="bg-primary text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} className="bg-primary text-white">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Section */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Your Activity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 text-center border-green-200 dark:border-green-800">
            <div className="text-green-600 dark:text-green-400 mb-2">
              <Camera className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.scans}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Plant Scans</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 text-center border-blue-200 dark:border-blue-800">
            <div className="text-blue-600 dark:text-blue-400 mb-2">
              <User className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.posts}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Community Posts</p>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 text-center border-orange-200 dark:border-orange-800">
            <div className="text-orange-600 dark:text-orange-400 mb-2">
              <TrendingUp className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.records}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Farm Records</p>
          </Card>
        </div>
      </div>

      {/* Account Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Account</h3>
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </Card>
      </div>
    </div>
  )
}
