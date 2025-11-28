import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const allowedHosts =
      process.env.NODE_ENV === "development"
        ? ["localhost:3000", "127.0.0.1:3000"]
        : ["myacuvue.com.br", "www.myacuvue.com.br"];

    const normalize = (host: string | null) => host?.trim().toLowerCase() ?? "";

    const host = normalize(request.headers.get("host"));
    const forwardedHost = normalize(request.headers.get("x-forwarded-host"));

    if (
      (host && !allowedHosts.includes(host)) ||
      (forwardedHost && !allowedHosts.includes(forwardedHost))
    ) {
      console.warn("🚨 Host inválido detectado:", host, forwardedHost);
      return new NextResponse("Bad Request – Invalid Host header", {
        status: 400,
      });
    }

    const routeMatches = request.headers.get("x-now-route-matches");
    if (routeMatches) {
      console.warn("🚨 Header suspeito detectado: x-now-route-matches");
      return new NextResponse("Bad Request – Suspicious Header", { status: 400 });
    }

    const isNextDataRequest =
      request.nextUrl.searchParams.get("__nextDataRequest") === "1";
    if (isNextDataRequest) {
      console.warn("🚨 Tentativa de __nextDataRequest bloqueada");
      return new NextResponse("Bad Request – Suspicious Query", { status: 400 });
    }

    return NextResponse.next();
  } catch (err: unknown) {
    console.error("❌ Erro no middleware:", err);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
