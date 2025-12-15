/**
 * Environment Variable Validation Script
 * Run this to check if all required API keys are configured
 * Usage: npx tsx scripts/validate-env.ts
 */

interface EnvCheck {
  name: string
  required: boolean
  description: string
  category: string
}

const ENV_CHECKS: EnvCheck[] = [
  // AI/ML API Keys
  {
    name: "GEMINI_API_KEY",
    required: true,
    description: "Google Gemini AI for image analysis & chat",
    category: "AI Services",
  },
  {
    name: "OPENROUTER_API_KEY",
    required: false,
    description: "OpenRouter for fallback AI (Amazon Nova)",
    category: "AI Services",
  },
  {
    name: "PERPLEXITY_API_KEY",
    required: false,
    description: "Perplexity AI for advanced search",
    category: "AI Services",
  },

  // Supabase/Database
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    description: "Supabase project URL",
    category: "Database",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: true,
    description: "Supabase public anon key",
    category: "Database",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    required: true,
    description: "Supabase service role key (CRITICAL - server only)",
    category: "Database",
  },
  {
    name: "POSTGRES_URL",
    required: true,
    description: "PostgreSQL connection string",
    category: "Database",
  },
]

function validateEnv() {
  console.log("\n🔍 Validating Environment Variables...\n")

  let hasErrors = false
  let hasWarnings = false

  const categories = Array.from(new Set(ENV_CHECKS.map((c) => c.category)))

  categories.forEach((category) => {
    console.log(`\n📦 ${category}`)
    console.log("=".repeat(50))

    const checks = ENV_CHECKS.filter((c) => c.category === category)

    checks.forEach((check) => {
      const value = process.env[check.name]
      const isSet = value && value.length > 0

      if (check.required) {
        if (isSet) {
          // Mask the key for security
          const maskedValue = value!.substring(0, 8) + "..." + value!.slice(-4)
          console.log(`✅ ${check.name}`)
          console.log(`   ${maskedValue}`)
          console.log(`   ${check.description}`)
        } else {
          console.log(`❌ ${check.name} (REQUIRED)`)
          console.log(`   Missing: ${check.description}`)
          hasErrors = true
        }
      } else {
        if (isSet) {
          const maskedValue = value!.substring(0, 8) + "..." + value!.slice(-4)
          console.log(`✅ ${check.name} (Optional)`)
          console.log(`   ${maskedValue}`)
        } else {
          console.log(`⚠️  ${check.name} (Optional)`)
          console.log(`   Not set: ${check.description}`)
          hasWarnings = true
        }
      }
    })
  })

  // Summary
  console.log("\n" + "=".repeat(50))
  console.log("\n📊 Summary:")

  if (hasErrors) {
    console.log("\n❌ VALIDATION FAILED")
    console.log("Missing required environment variables.")
    console.log("\nℹ️  To fix:")
    console.log("1. Copy .env.example to .env.local")
    console.log("2. Fill in the required values")
    console.log("3. Restart your development server")
    console.log("\nSee ENVIRONMENT_SETUP.md for detailed instructions.")
    process.exit(1)
  } else if (hasWarnings) {
    console.log("\n⚠️  VALIDATION PASSED WITH WARNINGS")
    console.log("All required keys are set, but some optional keys are missing.")
    console.log("The app will work, but some features may be limited.")
  } else {
    console.log("\n✅ ALL CHECKS PASSED")
    console.log("All environment variables are properly configured!")
  }

  console.log("\n")
}

// Run validation
validateEnv()
