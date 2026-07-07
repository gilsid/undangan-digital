import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isSuperadminPath = nextUrl.pathname.startsWith("/superadmin");

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  if (isSuperadminPath && req.auth?.user?.role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/dashboard/:path*", "/superadmin/:path*"],
  runtime: "nodejs",
};
