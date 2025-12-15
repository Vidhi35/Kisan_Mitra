"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Calendar, Sprout, Droplets, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFarmRecord, getFarmRecords } from "@/lib/actions/records"
import { toast } from "sonner"

interface FarmRecord {
  id: string
  activity_type: string
  crop_name: string
  description: string
  date: string
  created_at: string
}

export default function RecordsPage() {
  const [records, setRecords] = useState<FarmRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    activity_type: "",
    crop_name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    setLoading(true)
    const result = await getFarmRecords()
    if (result.data) {
      setRecords(result.data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await createFarmRecord(formData)

    if (result.error) {
      toast.error("Failed to create record")
    } else {
      toast.success("Record created successfully!")
      setIsDialogOpen(false)
      setFormData({
        activity_type: "",
        crop_name: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
      loadRecords()
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "planting":
        return <Sprout className="w-5 h-5 text-green-500" />
      case "irrigation":
        return <Droplets className="w-5 h-5 text-blue-500" />
      case "pesticide":
        return <Bug className="w-5 h-5 text-red-500" />
      default:
        return <Calendar className="w-5 h-5 text-slate-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Farm Records</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your farming activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Farm Record</DialogTitle>
              <DialogDescription>Log your farming activity to track your progress</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="activity_type">Activity Type</Label>
                <Select
                  value={formData.activity_type}
                  onValueChange={(value) => setFormData({ ...formData, activity_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planting">Planting</SelectItem>
                    <SelectItem value="irrigation">Irrigation</SelectItem>
                    <SelectItem value="fertilizing">Fertilizing</SelectItem>
                    <SelectItem value="pesticide">Pesticide Application</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="crop_name">Crop Name</Label>
                <Input
                  id="crop_name"
                  value={formData.crop_name}
                  onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                  placeholder="e.g., Wheat, Rice, Tomato"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about this activity..."
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-500 text-center mb-4">No farm records yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Record
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getActivityIcon(record.activity_type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg capitalize">{record.activity_type}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{record.crop_name}</p>
                      </div>
                      <p className="text-sm text-slate-500">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {record.description && <p className="text-slate-700 dark:text-slate-300">{record.description}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
