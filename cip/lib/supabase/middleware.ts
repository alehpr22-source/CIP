import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login") {
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
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

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

  return supabaseResponse
}
