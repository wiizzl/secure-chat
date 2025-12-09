import { NextResponse, type NextRequest } from "next/server";

import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/);
  if (!roomMatch) {
    return NextResponse.redirect(new URL("/?error=room-not-valid", req.url));
  }

  const roomId = roomMatch[1];

  const meta = await db.hgetall<{ connected: string[]; createdAt: number }>(`meta:${roomId}`);
  if (!meta) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url));
  }

  const existingToken = req.cookies.get("x-auth-token")?.value;
  if (existingToken && meta.connected.includes(existingToken)) {
    return NextResponse.next();
  }

  if (meta.connected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=room-full", req.url));
  }

  const response = NextResponse.next();
  const token = crypto.randomUUID();

  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await db.hset(`meta:${roomId}`, {
    connected: [...meta.connected, token],
  });

  return response;
};

export const config = {
  matcher: ["/room/:path*"],
};
