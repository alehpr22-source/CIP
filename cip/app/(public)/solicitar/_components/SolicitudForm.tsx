"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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

export function SolicitudForm({ carreras, sedes }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [validandoReniec, setValidandoReniec] = useState(false)
  const [reniecStatus, setReniecStatus] = useState<{
    valido: boolean
    mensaje: string
  } | null>(null)
  const [result, setResult] = useState<{ success?: boolean; expediente?: string; error?: string } | null>(null)

  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
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
  const [dniFile, setDniFile] = useState<File | null>(null)
  const [dniPreview, setDniPreview] = useState<string | null>(null)
  const [fotoError, setFotoError] = useState("")
  const [tituloError, setTituloError] = useState("")
  const [dniError, setDniError] = useState("")

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    if (field === "dni" || field === "nombres" || field === "apellido_paterno" || field === "apellido_materno") {
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

    setReniecStatus({ valido: res.valido, mensaje: res.mensaje })
    setValidandoReniec(false)
  }

  function validateStep0() {
    const newErrors: Record<string, string> = {}

    if (!form.dni) newErrors.dni = "El DNI es obligatorio"
    else if (!validarDNI(form.dni)) newErrors.dni = "El DNI debe tener 8 dígitos numéricos"

    if (!reniecStatus?.valido) {
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

    const input: SolicitudInput = {
      ...form,
      foto_base64: await toBase64(foto!),
      titulo_base64: await toBase64(titulo!),
      dni_base64: await toBase64(dniFile!),
      validado_reniec: reniecStatus?.valido ?? false,
    }

    const res = await registrarSolicitud(input)
    setResult(res)

    if (res.success) {
      setTimeout(() => router.push(`/consulta?dni=${form.dni}&correo=${encodeURIComponent(form.correo)}`), 2000)
    }

    setLoading(false)
  }

  function handleFileChange(
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

  const previewUrlsRef = useRef<string[]>([])

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(URL.revokeObjectURL)
    }
  }, [])

  return (
    <div className="space-y-8">
      {result?.success && (
        <Alert variant="success" title="Solicitud registrada exitosamente">
          <p>Tu expediente ha sido creado.</p>
          <p className="mt-1">Serás redirigido a la consulta de tu trámite...</p>
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
                />
                <Input
                  label="Apellido Paterno"
                  placeholder="Pérez"
                  value={form.apellido_paterno}
                  onChange={(e) => updateField("apellido_paterno", e.target.value)}
                  error={errors.apellido_paterno}
                />
                <Input
                  label="Apellido Materno"
                  placeholder="García"
                  value={form.apellido_materno}
                  onChange={(e) => updateField("apellido_materno", e.target.value)}
                  error={errors.apellido_materno}
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
                onChange={handleFileChange(setFoto, setFotoPreview, setFotoError, () => fotoPreview)}
              />

              <FileUpload
                label="Título profesional"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={10}
                preview={tituloPreview}
                error={tituloError}
                onChange={handleFileChange(setTitulo, setTituloPreview, setTituloError, () => tituloPreview)}
              />

              <FileUpload
                label="Copia del DNI"
                accept=".jpg,.jpeg,.png,.pdf"
                maxSizeMB={5}
                preview={dniPreview}
                error={dniError}
                onChange={handleFileChange(setDniFile, setDniPreview, setDniError, () => dniPreview)}
              />

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>Atrás</Button>
                <Button onClick={() => { if (validateStep1()) setStep(2) }}>
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
                <p><span className="font-medium text-gray-700">Carrera:</span> {carreras.find((c) => c.id === form.carrera_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Sede:</span> {sedes.find((s) => s.id === form.sede_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Universidad:</span> {form.universidad}</p>
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
