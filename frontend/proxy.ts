import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Authentication bypassed for development - all routes are accessible
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
