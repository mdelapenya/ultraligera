import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Propagate the request pathname as an `x-pathname` header so server
 * components (specifically the root layout) can derive the active locale
 * for `<html lang>`. Root layouts don't receive route params, so without
 * this middleware every page would render with the hardcoded fallback.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  // Skip Next.js internals and static assets to keep middleware cheap.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
