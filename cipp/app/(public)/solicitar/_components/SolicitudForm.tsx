"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { FileUpload } from "@/components/ui/FileUpload"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { validarDniConReniec, verificarDniExistente, registrarSolicitud, type SolicitudInput } from "@/actions/solicitud.actions"
import type { Sede, Universidad, Carrera } from "@/types"

interface Props {
  sedes: Sede[]
  universidades: Universidad[]
  carreras: Carrera[]
}

const STEPS = ["Datos personales", "Documentos", "Confirmación"]

function validarDNI(value: string) {
  return /^\d{8}$/.test(value)
}

const CARRERA_OTRA_VALUE = "otra"

export function SolicitudForm({ sedes, universidades, carreras }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [validandoReniec, setValidandoReniec] = useState(false)
  const [reniecValidated, setReniecValidated] = useState(false)
  const [reniecStatus, setReniecStatus] = useState<{
    valido: boolean
    mensaje: string
  } | null>(null)
  const [duplicadoError, setDuplicadoError] = useState("")
  const [result, setResult] = useState<{ success?: boolean; expediente?: string; error?: string } | null>(null)

  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    telefono: "",
    sede_id: "",
    universidad_id: "",
    universidad: "",
    carrera_id: "",
    carrera_manual: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [titulo, setTitulo] = useState<File | null>(null)
  const [tituloPreview, setTituloPreview] = useState<string | null>(null)
  const [dniFile, setDniFile] = useState<File | null>(null)
  const [dniPreview, setDniPreview] = useState<string | null>(null)
  const [confirmarCorreo, setConfirmarCorreo] = useState("")
  const [confirmarCorreoError, setConfirmarCorreoError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [fotoError, setFotoError] = useState("")
  const [tituloError, setTituloError] = useState("")
  const [dniError, setDniError] = useState("")

  const previewUrlsRef = useRef<string[]>([])

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "sede_id") {
        next.universidad_id = ""
        next.universidad = ""
      }
      if (field === "universidad_id") {
        const univ = universidades.find((u) => u.id === value)
        next.universidad = univ?.nombre ?? ""
      }
      if (field === "carrera_id") {
        if (value && value !== CARRERA_OTRA_VALUE) {
          const carrera = carreras.find((c) => c.id === value)
          next.carrera_manual = carrera?.nombre ?? ""
        }
      }
      return next
    })
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    if (field === "dni" || field === "nombres" || field === "apellido_paterno" || field === "apellido_materno") {
      setReniecStatus(null)
      if (field === "dni") { setReniecValidated(false); setDuplicadoError("") }
    }
  }, [universidades, carreras])

  function datosReniecCompletos() {
    return form.dni.length === 8
  }

  async function handleValidarReniec() {
    if (!datosReniecCompletos()) return

    setValidandoReniec(true)
    setReniecStatus(null)

    try {
      const res = await validarDniConReniec(form.dni, "", "")

      if (!res.valido) {
        setReniecStatus({ valido: false, mensaje: res.mensaje })
        return
      }

      const { existe } = await verificarDniExistente(form.dni)

      if (existe) {
        setDuplicadoError("Este DNI ya tiene una solicitud registrada. Si olvidaste tus credenciales, usa 'Olvidé mi contraseña' en el inicio de sesión.")
        setReniecStatus({ valido: true, mensaje: "Identidad verificada" })
        setReniecValidated(true)
        return
      }

      if (res.nombres && res.apellidos) {
        const parts = res.apellidos.split(" ")
        setForm((prev) => ({
          ...prev,
          nombres: res.nombres!,
          apellido_paterno: parts[0] ?? "",
          apellido_materno: parts.slice(1).join(" ") ?? "",
        }))
        setErrors((prev) => {
          const next = { ...prev }
          delete next.nombres
          delete next.apellido_paterno
          delete next.apellido_materno
          return next
        })
      }

      setReniecStatus({ valido: true, mensaje: "Identidad verificada correctamente" })
      setReniecValidated(true)
    } catch {
      setReniecStatus({ valido: false, mensaje: "Error inesperado al consultar RENIEC" })
    }

    setValidandoReniec(false)
  }

  function validateStep0() {
    const newErrors: Record<string, string> = {}

    if (!form.dni) newErrors.dni = "El DNI es obligatorio"
    else if (!validarDNI(form.dni)) newErrors.dni = "El DNI debe tener 8 dígitos numéricos"

    if (!reniecStatus?.valido) {
      newErrors.reniec = "Debe validar el DNI con RENIEC antes de continuar"
    }

    if (duplicadoError) {
      newErrors.reniec = duplicadoError
    }

    if (form.correo && confirmarCorreo !== form.correo) {
      setConfirmarCorreoError("Los correos no coinciden")
      newErrors.correo = "Los correos no coinciden"
    }

    if (!form.sede_id) newErrors.sede_id = "Selecciona una sede"
    if (!form.universidad_id) newErrors.universidad_id = "Selecciona una universidad"
    if (!form.carrera_id && !form.carrera_manual) newErrors.carrera_manual = "Selecciona o escribe tu carrera"
    if (form.carrera_id === CARRERA_OTRA_VALUE && !form.carrera_manual) newErrors.carrera_manual = "Escribe el nombre de tu carrera"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateStep1() {
    let valid = true
    setFotoError("")
    setTituloError("")
    setDniError("")
    if (!foto) { setFotoError("La foto personal es obligatoria"); valid = false }
    if (!titulo) { setTituloError("El título profesional es obligatorio"); valid = false }
    if (!dniFile) { setDniError("La copia del DNI es obligatoria"); valid = false }
    return valid
  }

  async function handleSubmit() {
    setLoading(true)
    setResult(null)

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

    if (!password || password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    const input: SolicitudInput = {
      ...form,
      carrera_id: form.carrera_id && form.carrera_id !== CARRERA_OTRA_VALUE ? form.carrera_id : null,
      universidad_id: form.universidad_id || null,
      foto_base64: await toBase64(foto!),
      titulo_base64: await toBase64(titulo!),
      dni_base64: await toBase64(dniFile!),
      validado_reniec: reniecStatus?.valido ?? false,
      password,
    }

    const res = await registrarSolicitud(input)
    setResult(res)

    if (res.success) {
      setTimeout(() => router.push("/login"), 3000)
    }

    setLoading(false)
  }

  function makeFileHandler(
    setFile: (f: File | null) => void,
    setPreview: (u: string | null) => void,
    setError: (e: string) => void,
    getPreview: () => string | null,
  ) {
    return (file: File | null) => {
      const oldPreview = getPreview()
      if (oldPreview) {
        URL.revokeObjectURL(oldPreview)
        previewUrlsRef.current = previewUrlsRef.current.filter(u => u !== oldPreview)
      }
      setFile(file)
      setError("")
      if (file) {
        const url = URL.createObjectURL(file)
        previewUrlsRef.current.push(url)
        setPreview(url)
      } else {
        setPreview(null)
      }
    }
  }

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(URL.revokeObjectURL)
    }
  }, [])

  return (
    <div className="space-y-8">
      {result?.success && (
        <Alert variant="success" title="Solicitud registrada exitosamente">
          <p>Tu expediente ha sido creado. Tu cuenta ha sido registrada con el correo <strong>{form.correo}</strong>.</p>
          <p className="mt-1">Serás redirigido a la página de inicio de sesión para acceder a tu dashboard...</p>
        </Alert>
      )}

      {result?.error && (
        <Alert variant="error" title="Error">
          {result.error}
        </Alert>
      )}

      {!result?.success && (
        <>
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i === step
                      ? "bg-cip-red text-white"
                      : i < step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`hidden text-sm sm:inline ${i === step ? "font-medium text-gray-900" : "text-gray-500"}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className="h-px w-8 bg-gray-300" />}
              </div>
            ))}
          </div>

          {/* Paso 1: Datos personales + RENIEC */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <Input
                  label="DNI"
                  placeholder="12345678"
                  maxLength={8}
                  value={form.dni}
                  onChange={(e) => updateField("dni", e.target.value.replace(/\D/g, ""))}
                  error={errors.dni}
                />
                <Input
                  label="Nombres"
                  placeholder="Juan Carlos"
                  value={form.nombres}
                  onChange={(e) => updateField("nombres", e.target.value)}
                  error={errors.nombres}
                  disabled={reniecValidated}
                />
                <Input
                  label="Apellido Paterno"
                  placeholder="Pérez"
                  value={form.apellido_paterno}
                  onChange={(e) => updateField("apellido_paterno", e.target.value)}
                  error={errors.apellido_paterno}
                  disabled={reniecValidated}
                />
                <Input
                  label="Apellido Materno"
                  placeholder="García"
                  value={form.apellido_materno}
                  onChange={(e) => updateField("apellido_materno", e.target.value)}
                  error={errors.apellido_materno}
                  disabled={reniecValidated}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  loading={validandoReniec}
                  disabled={!datosReniecCompletos() || validandoReniec}
                  onClick={handleValidarReniec}
                >
                  Validar con RENIEC
                </Button>

                {validandoReniec && <Spinner size="sm" />}

                {reniecStatus && (
                  <span className={`text-sm font-medium ${reniecStatus.valido ? "text-green-600" : "text-red-600"}`}>
                    {reniecStatus.valido ? "✓ Identidad verificada" : `✗ ${reniecStatus.mensaje}`}
                  </span>
                )}
              </div>

              {errors.reniec && <p className="text-sm text-red-600">{errors.reniec}</p>}

              {duplicadoError && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  ✗ {duplicadoError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.correo}
                  onChange={(e) => { updateField("correo", e.target.value); setConfirmarCorreoError("") }}
                />
                <Input
                  label="Confirmar correo electrónico"
                  type="email"
                  placeholder="repite el correo"
                  value={confirmarCorreo}
                  onChange={(e) => { setConfirmarCorreo(e.target.value); setConfirmarCorreoError("") }}
                />
              </div>
              {confirmarCorreoError && <p className="text-sm text-red-600">{confirmarCorreoError}</p>}

              <Input
                label="Teléfono"
                placeholder="999888777"
                value={form.telefono}
                onChange={(e) => updateField("telefono", e.target.value.replace(/\D/g, ""))}
              />

              <Select
                label="Sede"
                placeholder="Selecciona una sede"
                options={sedes.map((s) => ({ value: s.id, label: s.nombre }))}
                value={form.sede_id}
                onChange={(e) => updateField("sede_id", e.target.value)}
                error={errors.sede_id}
              />

              <Select
                label="Universidad"
                placeholder="Selecciona una universidad"
                options={universidades.map((u) => ({ value: u.id, label: u.nombre }))}
                value={form.universidad_id}
                onChange={(e) => updateField("universidad_id", e.target.value)}
                error={errors.universidad_id}
              />

              <Select
                label="Carrera de ingeniería"
                placeholder="Selecciona una carrera"
                options={[
                  ...carreras.map((c) => ({ value: c.id, label: c.nombre })),
                  { value: CARRERA_OTRA_VALUE, label: "No está aquí / Otra" },
                ]}
                value={form.carrera_id}
                onChange={(e) => updateField("carrera_id", e.target.value)}
                error={!form.carrera_id || form.carrera_id === CARRERA_OTRA_VALUE ? errors.carrera_manual : undefined}
              />

              {form.carrera_id === CARRERA_OTRA_VALUE && (
                <Input
                  label="Escribe tu carrera"
                  placeholder="Nombre de tu carrera"
                  value={form.carrera_manual}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, carrera_manual: e.target.value }))
                    setErrors((prev) => { const n = { ...prev }; delete n.carrera_manual; return n })
                  }}
                  error={errors.carrera_manual}
                />
              )}

              <div className="flex justify-end pt-4">
                <Button
                  variant="danger"
                  disabled={!!duplicadoError}
                  onClick={() => { if (validateStep0()) setStep(1) }}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Paso 2: Documentos (foto, título, copia DNI) */}
          {step === 1 && (
            <div className="space-y-6">
              <FileUpload
                label="Foto personal"
                hint="De frente, vestimenta formal, fondo claro"
                accept=".jpg,.jpeg,.png"
                maxSizeMB={5}
                preview={fotoPreview}
                error={fotoError}
                onChange={makeFileHandler(setFoto, setFotoPreview, setFotoError, () => fotoPreview)}
              />

              <FileUpload
                label="Título profesional"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={10}
                preview={tituloPreview}
                error={tituloError}
                onChange={makeFileHandler(setTitulo, setTituloPreview, setTituloError, () => tituloPreview)}
              />

              <FileUpload
                label="Copia del DNI"
                accept=".jpg,.jpeg,.png,.pdf"
                maxSizeMB={5}
                preview={dniPreview}
                error={dniError}
                onChange={makeFileHandler(setDniFile, setDniPreview, setDniError, () => dniPreview)}
              />

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>Atrás</Button>
                <Button variant="danger" onClick={() => { if (validateStep1()) setStep(2) }}>
                  Revisar y enviar
                </Button>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {step === 2 && (
            <div className="space-y-4">
              <Alert variant="info" title="Resumen de tu solicitud">
                <p>Revisa todos los datos antes de enviar.</p>
              </Alert>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                <p><span className="font-medium text-gray-700">DNI:</span> {form.dni}</p>
                <p><span className="font-medium text-gray-700">Nombres:</span> {form.nombres} {form.apellido_paterno} {form.apellido_materno}</p>
                <p><span className="font-medium text-gray-700">Sede:</span> {sedes.find((s) => s.id === form.sede_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Universidad:</span> {form.universidad || universidades.find((u) => u.id === form.universidad_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Carrera:</span> {carreras.find((c) => c.id === form.carrera_id)?.nombre ?? form.carrera_manual}</p>
                <p>
                  <span className="font-medium text-gray-700">RENIEC:</span>{" "}
                  <span className="text-green-600">Verificado</span>
                </p>
                {fotoPreview && (
                  <div>
                    <span className="font-medium text-gray-700">Foto:</span>{" "}
                    <img src={fotoPreview} alt="Foto" className="mt-1 inline-block h-16 w-16 rounded-full object-cover" />
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium">🔐 Crear tu cuenta</p>
                <p className="mt-1">Ingresa una contraseña para acceder a tu dashboard personal donde podrás dar seguimiento a tu trámite.</p>
              </div>

              <Input
                label="Contraseña (mín. 6 caracteres)"
                type="password"
                placeholder="Crea una contraseña segura"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError("") }}
                error={passwordError}
              />

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                <Button variant="danger" loading={loading} onClick={handleSubmit}>Enviar solicitud</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
