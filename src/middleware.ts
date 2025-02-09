import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { COOKIE_KEYS } from "./server/constants"

const PUBLIC_ROUTES = ["/", "/login"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEYS.token)
  const userId = request.cookies.get(COOKIE_KEYS.userId)

  // Se não tiver token, redireciona para o login
  if (!token && !PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se tiver token, verifica se é válido
  if (token) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      const data = await response.json()

      // Se o userId do cookie não bater com o do token
      if (data.data.userId !== Number(userId?.value)) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Se estiver autenticado e tentar acessar uma rota pública
      if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/app", request.url))
      }
    } catch (error) {
      // Se houver qualquer erro, redireciona para o login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
