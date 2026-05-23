"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { FileUpload } from "@/components/ui/FileUpload"
import { Alert } from "@/components/ui/Alert"
import { Spinner } from "@/components/ui/Spinner"
import { validarDniConReniec, registrarSolicitud, type SolicitudInput } from "@/actions/solicitud.actions"
import type { Carrera, Sede } from "@/types"

interface Props {
  carreras: Carrera[]
  sedes: Sede[]
}

const STEPS = ["Datos personales", "Documentos", "Confirmación"]

function validarDNI(value: string) {
  return /^\d{8}$/.test(value)
}

function validarTexto(value: string) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(value)
}

export function SolicitudForm({ carreras, sedes }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [validandoReniec, setValidandoReniec] = useState(false)
  const [reniecStatus, setReniecStatus] = useState<{
    valido: boolean
    mensaje: string
  } | null>(null)
  const [result, setResult] = useState<{ success: boolean; expediente?: string; error?: string } | null>(null)

  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    carrera_id: "",
    sede_id: "",
    universidad: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [titulo, setTitulo] = useState<File | null>(null)
  const [tituloPreview, setTituloPreview] = useState<string | null>(null)
  const [fotoError, setFotoError] = useState("")
  const [tituloError, setTituloError] = useState("")

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    if (field === "dni" || field === "nombres" || field === "apellidos") {
      setReniecStatus(null)
    }
  }, [])

  function datosReniecCompletos() {
    return form.dni.length === 8
  }

  async function handleValidarReniec() {
    if (!datosReniecCompletos()) return

    setValidandoReniec(true)
    setReniecStatus(null)

    const res = await validarDniConReniec(form.dni, "", "")

    if (res.nombres && res.apellidos) {
      setForm((prev) => ({
        ...prev,
        nombres: res.nombres!,
        apellidos: res.apellidos!,
      }))
      setErrors((prev) => {
        const next = { ...prev }
        delete next.nombres
        delete next.apellidos
        return next
      })
    }

    setReniecStatus({ valido: res.valido, mensaje: res.mensaje })
    setValidandoReniec(false)
  }

  function validateStep0() {
    const newErrors: Record<string, string> = {}

    if (!form.dni) newErrors.dni = "El DNI es obligatorio"
    else if (!validarDNI(form.dni)) newErrors.dni = "El DNI debe tener 8 dígitos numéricos"

    if (!form.nombres) newErrors.nombres = "Los nombres son obligatorios"
    else if (!validarTexto(form.nombres)) newErrors.nombres = "Caracteres inválidos en nombres"

    if (!form.apellidos) newErrors.apellidos = "Los apellidos son obligatorios"
    else if (!validarTexto(form.apellidos)) newErrors.apellidos = "Caracteres inválidos en apellidos"

    if (!reniecStatus?.valido && reniecStatus !== null) {
      newErrors.reniec = "Debe validar el DNI con RENIEC antes de continuar"
    }

    if (!form.carrera_id) newErrors.carrera_id = "Selecciona una carrera"
    if (!form.sede_id) newErrors.sede_id = "Selecciona una sede"
    if (!form.universidad) newErrors.universidad = "La universidad es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateStep1() {
    let valid = true
    setFotoError("")
    setTituloError("")
    if (!foto) { setFotoError("La foto personal es obligatoria"); valid = false }
    if (!titulo) { setTituloError("El título profesional es obligatorio"); valid = false }
    return valid
  }

  async function handleSubmit() {
    if (!validateStep1()) return

    setLoading(true)
    setResult(null)

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

    const input: SolicitudInput = {
      ...form,
      foto_base64: await toBase64(foto!),
      titulo_base64: await toBase64(titulo!),
    }

    const res = await registrarSolicitud(input)
    setResult(res)

    if (res.success) {
      setTimeout(() => router.push(`/pago/${res.expedienteId}`), 2000)
    }

    setLoading(false)
  }

  function handleFotoChange(file: File | null) {
    setFoto(file)
    setFotoError("")
    if (file) {
      setFotoPreview(URL.createObjectURL(file))
    } else {
      setFotoPreview(null)
    }
  }

  function handleTituloChange(file: File | null) {
    setTitulo(file)
    setTituloError("")
    if (file) {
      setTituloPreview(URL.createObjectURL(file))
    } else {
      setTituloPreview(null)
    }
  }

  return (
    <div className="space-y-8">
      {result?.success && (
        <Alert variant="success" title="Solicitud registrada">
          <p>Tu expediente <strong>{result.expediente}</strong> ha sido creado.</p>
          <p className="mt-1">Serás redirigido al paso de pago...</p>
        </Alert>
      )}

      {result?.error && (
        <Alert variant="error" title="Error">
          {result.error}
        </Alert>
      )}

      {!result?.success && (
        <>
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i === step
                      ? "bg-blue-700 text-white"
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

          {/* Step 0: Datos personales */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
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
                />
                <Input
                  label="Apellidos"
                  placeholder="Pérez García"
                  value={form.apellidos}
                  onChange={(e) => updateField("apellidos", e.target.value)}
                  error={errors.apellidos}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.correo}
                  onChange={(e) => updateField("correo", e.target.value)}
                />
                <Input
                  label="Teléfono"
                  placeholder="999888777"
                  value={form.telefono}
                  onChange={(e) => updateField("telefono", e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <Select
                label="Carrera de ingeniería"
                placeholder="Selecciona una carrera"
                options={carreras.map((c) => ({ value: c.id, label: `${c.codigo} - ${c.nombre}` }))}
                value={form.carrera_id}
                onChange={(e) => updateField("carrera_id", e.target.value)}
                error={errors.carrera_id}
              />

              <Select
                label="Sede"
                placeholder="Selecciona una sede"
                options={sedes.map((s) => ({ value: s.id, label: s.nombre }))}
                value={form.sede_id}
                onChange={(e) => updateField("sede_id", e.target.value)}
                error={errors.sede_id}
              />

              <Input
                label="Universidad"
                placeholder="Universidad Nacional de Ingeniería"
                value={form.universidad}
                onChange={(e) => updateField("universidad", e.target.value)}
                error={errors.universidad}
              />

              <div className="flex justify-end pt-4">
                <Button onClick={() => { if (validateStep0()) setStep(1) }}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Step 1: Documentos */}
          {step === 1 && (
            <div className="space-y-6">
              <FileUpload
                label="Foto personal"
                accept=".jpg,.jpeg,.png"
                maxSizeMB={5}
                preview={fotoPreview}
                error={fotoError}
                onChange={handleFotoChange}
              />

              <FileUpload
                label="Título profesional"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={10}
                preview={tituloPreview}
                error={tituloError}
                onChange={handleTituloChange}
              />

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>Atrás</Button>
                <Button onClick={() => setStep(2)}>Revisar solicitud</Button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmación */}
          {step === 2 && (
            <div className="space-y-4">
              <Alert variant="info" title="Resumen de tu solicitud">
                <p>Revisa tus datos antes de enviar la solicitud.</p>
              </Alert>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                <p><span className="font-medium text-gray-700">DNI:</span> {form.dni}</p>
                <p><span className="font-medium text-gray-700">Nombres:</span> {form.nombres} {form.apellidos}</p>
                <p><span className="font-medium text-gray-700">Carrera:</span> {carreras.find((c) => c.id === form.carrera_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Sede:</span> {sedes.find((s) => s.id === form.sede_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Universidad:</span> {form.universidad}</p>
                <p>
                  <span className="font-medium text-gray-700">RENIEC:</span>{" "}
                  <span className={reniecStatus?.valido ? "text-green-600" : "text-red-600"}>
                    {reniecStatus?.valido ? "Verificado" : "No validado"}
                  </span>
                </p>
                {fotoPreview && (
                  <div>
                    <span className="font-medium text-gray-700">Foto:</span>{" "}
                    <img src={fotoPreview} alt="Foto" className="mt-1 inline-block h-16 w-16 rounded-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                <Button loading={loading} onClick={handleSubmit}>Enviar solicitud</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
