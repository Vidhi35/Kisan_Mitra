/**
 * Quick Health Check Script
 * Run: npm run check-health
 */

console.log("\n🏥 Running Health Check...\n")

const baseUrl = "http://localhost:3000"

fetch(`${baseUrl}/api/health`)
  .then((res) => res.json())
  .then((data) => {
    console.log("Status:", data.status.toUpperCase())
    console.log("Time:", data.timestamp)
    console.log("\n📋 Services:")
    console.log("━".repeat(50))

    Object.entries(data.checks).forEach(([service, check]) => {
      console.log(`\n${service.toUpperCase()}:`)
      console.log(`  ${check.status}`)
    })

    console.log("\n" + "━".repeat(50))

    if (data.status === "ok") {
      console.log("\n✅ All systems operational!")
      console.log("\n🚀 Ready to start development")
      process.exit(0)
    } else {
      console.log("\n⚠️ Some services need configuration")
      console.log("\n📝 Run: npm run validate-env")
      console.log("   Or: npm run setup-env")
      process.exit(1)
    }
  })
  .catch((error) => {
    console.log("\n❌ Health check failed!")
    console.log("\nError:", error.message)
    console.log("\n💡 Make sure the dev server is running:")
    console.log("   npm run dev")
    console.log("\n   Then run this check again in another terminal:")
    console.log("   npm run check-health")
    process.exit(1)
  })
