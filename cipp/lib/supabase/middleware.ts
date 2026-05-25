import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith("/admin")
  const isUserRoute = pathname.startsWith("/micuenta")

  if (isAdminRoute && pathname === "/admin/login") {
    return NextResponse.next({ request })
  }

  if (isUserRoute && pathname === "/micuenta/login") {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    if (isUserRoute) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return supabaseResponse
  }

  if (isAdminRoute) {
    const { data: admin } = await supabase
      .from("usuarios_admin")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

    if (!admin) {
      await supabase.auth.signOut()
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("error", "no_autorizado")
      return NextResponse.redirect(url)
    }
  }

  if (isUserRoute) {
    const { data: solicitante } = await supabase
      .from("solicitantes")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

    if (!solicitante) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return supabaseResponse
}
