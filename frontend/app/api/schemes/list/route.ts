import { NextResponse } from "next/server"

/**
 * Government Schemes List API
 * Returns top agricultural schemes for Indian farmers (2025-2026)
 */

const TOP_SCHEMES = [
  {
    id: 1,
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    desc: "Direct income support of ₹6,000 per year to small and marginal farmers",
    subsidy: "₹6,000/year",
    msp: "N/A",
    category: "Income Support",
    eligibility: "Small & Marginal Farmers",
    website: "pmkisan.gov.in",
  },
  {
    id: 2,
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    desc: "Comprehensive crop insurance scheme protecting farmers against crop loss",
    subsidy: "Premium subsidy up to 90%",
    msp: "Varies by crop",
    category: "Insurance",
    eligibility: "All Farmers",
    website: "pmfby.gov.in",
  },
  {
    id: 3,
    name: "Copra MSP 2026",
    fullName: "Copra Minimum Support Price",
    desc: "Government procurement of milling copra at minimum support price",
    subsidy: "₹445 increase",
    msp: "₹12,027/quintal",
    category: "MSP",
    eligibility: "Coconut Farmers",
    website: "agricoop.gov.in",
  },
  {
    id: 4,
    name: "PMKSY",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    desc: "Irrigation subsidy scheme - More crop per drop",
    subsidy: "Up to 90% on micro-irrigation",
    msp: "N/A",
    category: "Irrigation",
    eligibility: "All Farmers",
    website: "pmksy.gov.in",
  },
  {
    id: 5,
    name: "RKVY-RAFTAAR",
    fullName: "Rashtriya Krishi Vikas Yojana",
    desc: "Agriculture infrastructure development and innovation",
    subsidy: "Project-based funding",
    msp: "N/A",
    category: "Infrastructure",
    eligibility: "FPOs, Cooperatives",
    website: "rkvy.nic.in",
  },
  {
    id: 6,
    name: "KCC",
    fullName: "Kisan Credit Card",
    desc: "Credit facility for farmers at subsidized interest rates",
    subsidy: "Interest subvention up to 3%",
    msp: "N/A",
    category: "Credit",
    eligibility: "All Farmers",
    website: "pmkisan.gov.in/KCC.aspx",
  },
  {
    id: 7,
    name: "PM-KUSUM",
    fullName: "Solar Pump Scheme",
    desc: "Solar pump installation with 90% subsidy",
    subsidy: "Up to 90% on solar pumps",
    msp: "N/A",
    category: "Energy",
    eligibility: "All Farmers",
    website: "mnre.gov.in",
  },
]

export async function GET() {
  try {
    // In production, this could fetch from database or cache
    return NextResponse.json({
      success: true,
      data: TOP_SCHEMES,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Schemes API] Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch schemes" }, { status: 500 })
  }
}
