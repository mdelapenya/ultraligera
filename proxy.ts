import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Propagate the request pathname as an `x-pathname` header so server
 * components (specifically the root layout) can derive the active locale
 * for `<html lang>`. Root layouts don't receive route params, so without
 * this proxy every page would render with the hardcoded fallback.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`. The
 * exported function follows the same name.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  // Skip Next.js internals and static assets to keep the proxy cheap.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
