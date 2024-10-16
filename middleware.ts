// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  user: {
    role: string;
    // other properties can be added here as needed
  };
}

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("token");
  // console.log(tokenCookie);
  const token = tokenCookie ? tokenCookie.value : null;

  // Redirect to login if token is missing
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = (await jwtVerify(
      token,
      new TextEncoder().encode("vaibhav")
    )) as { payload: JwtPayload };
    const userRole = payload.user.role;
    const pathname = req.nextUrl.pathname;
    if (pathname.startsWith("/buyer") && userRole !== "buyer") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/seller") && userRole !== "seller") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/approver") && userRole !== "approver") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  } catch (error) {
    alert(JSON.stringify(error));
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Continue if everything is good
  return NextResponse.next();
}

// Specify which paths should be checked by middleware
export const config = {
  matcher: ["/buyer/:path*", "/seller/:path*", "/approver/:path*"], // Define restricted routes
};
