import { NextResponse } from "next/server"

/**
 * Health Check API
 * Tests if all critical API keys are configured
 * GET /api/health
 */
export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        status: process.env.GEMINI_API_KEY ? "✅ Ready" : "❌ Missing",
      },
      openrouter: {
        configured: !!process.env.OPENROUTER_API_KEY,
        status: process.env.OPENROUTER_API_KEY ? "✅ Ready" : "⚠️ Optional (fallback)",
      },
      supabase: {
        configured:
          !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
          !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
          !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        status:
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
          process.env.SUPABASE_SERVICE_ROLE_KEY
            ? "✅ Ready"
            : "❌ Missing",
      },
      database: {
        configured: !!process.env.POSTGRES_URL,
        status: process.env.POSTGRES_URL ? "✅ Ready" : "❌ Missing",
      },
    },
  }

  // Check if all critical services are configured
  const allReady =
    health.checks.gemini.configured && health.checks.supabase.configured && health.checks.database.configured

  if (!allReady) {
    health.status = "error"
    return NextResponse.json(health, { status: 503 })
  }

  return NextResponse.json(health, { status: 200 })
}
