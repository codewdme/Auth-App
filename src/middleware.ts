import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export function getJwtSecretKey() {
  const secret = process.env.TOKEN_SECRET!;
  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }
  return new TextEncoder().encode(secret);
}

async function validateToken(token: string | undefined) {
  try {
    if (!token) {
      return null;
    }

    // Verify the JWT token
    const decodedToken = await jwtVerify(token, getJwtSecretKey());

    // Add additional checks if needed (e.g., check token expiration)

    return decodedToken; // Return the decoded token
  } catch (error) {
    // Token verification failed
    console.log(error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup";

  const token = request.cookies.get("token")?.value || "";

  // Validate the token
  const decodedToken = await validateToken(token);

  if (isPublicPath && decodedToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !decodedToken) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/profile", "/login", "/signup"],
};
