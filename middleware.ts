export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/admin/dashboard/:path*", "/superadmin/:path*"],
};
