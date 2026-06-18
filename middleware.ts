import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", request.nextUrl.pathname);
    return response;
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (path === "/admin/login") {
          return true;
        }

        return token?.role === "ADMIN";
      },
    },
  },
);

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
