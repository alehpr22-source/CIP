"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { createClient } from "@/lib/supabase/client"

export default function RestablecerPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      if (data.session) setReady(true)
    }
    init()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password })

      if (err) {
        setError(err.message)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch {
      setError("Error al actualizar la contraseña")
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-lg border bg-white p-8 shadow-sm text-center">
          <div className="mb-4 text-4xl">✅</div>
          <h1 className="mb-2 text-xl font-bold text-gray-800">Contraseña actualizada</h1>
          <p className="text-sm text-gray-600">
            Tu contraseña se ha restablecido correctamente. Serás redirigido al inicio de sesión...
          </p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-lg border bg-white p-8 shadow-sm text-center">
          <p className="text-sm text-gray-600">Validando enlace de recuperación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">Restablecer Contraseña</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Ingresa tu nueva contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nueva contraseña"
            type="password"
            placeholder="Mín. 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          {error && (
            <Alert variant="error" title="Error">
              {error}
            </Alert>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Restablecer contraseña
          </Button>
        </form>
      </div>
    </div>
  )
}
