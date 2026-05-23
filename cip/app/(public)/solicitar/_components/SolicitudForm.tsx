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
import { generarVoucher } from "@/lib/pago/procesador"
import type { Carrera, Sede } from "@/types"

interface Props {
  carreras: Carrera[]
  sedes: Sede[]
}

const STEPS = ["Datos personales", "Documentos", "Pago", "Confirmación"]

function validarDNI(value: string) {
  return /^\d{8}$/.test(value)
}

export function SolicitudForm({ carreras, sedes }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pagando, setPagando] = useState(false)
  const [validandoReniec, setValidandoReniec] = useState(false)
  const [reniecStatus, setReniecStatus] = useState<{
    valido: boolean
    mensaje: string
  } | null>(null)
  const [voucherData, setVoucherData] = useState<{
    transaccionId: string
    voucherBase64: string
    fecha: string
  } | null>(null)
  const [result, setResult] = useState<{ success?: boolean; expediente?: string; error?: string } | null>(null)

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

  async function handlePagar() {
    setPagando(true)

    await new Promise((r) => setTimeout(r, 2000))

    const transaccionId = "TXN-" + Date.now().toString(36).toUpperCase()

    const vData = generarVoucher({
      transaccionId,
      dni: form.dni,
      nombres: form.nombres,
      apellidos: form.apellidos,
      monto: 1500,
    })

    setVoucherData({ transaccionId, voucherBase64: vData.voucherBase64, fecha: vData.fecha })
    setPagando(false)
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
      voucher_base64: voucherData?.voucherBase64 ?? "",
      transaccion_id: voucherData?.transaccionId ?? "",
    }

    const res = await registrarSolicitud(input)
    setResult(res)

    if (res.success) {
      setTimeout(() => router.push(`/consulta?dni=${form.dni}`), 2000)
    }

    setLoading(false)
  }

  function handleFileChange(
    setFile: (f: File | null) => void,
    setPreview: (u: string | null) => void,
    setError: (e: string) => void,
  ) {
    return (file: File | null) => {
      setFile(file)
      setError("")
      if (file) {
        setPreview(URL.createObjectURL(file))
      } else {
        setPreview(null)
      }
    }
  }

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

          {/* Paso 2: Documentos (foto, título, copia DNI) */}
          {step === 1 && (
            <div className="space-y-6">
              <FileUpload
                label="Foto personal"
                accept=".jpg,.jpeg,.png"
                maxSizeMB={5}
                preview={fotoPreview}
                error={fotoError}
                onChange={handleFileChange(setFoto, setFotoPreview, setFotoError)}
              />

              <FileUpload
                label="Título profesional"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={10}
                preview={tituloPreview}
                error={tituloError}
                onChange={handleFileChange(setTitulo, setTituloPreview, setTituloError)}
              />

              <FileUpload
                label="Copia del DNI"
                accept=".jpg,.jpeg,.png,.pdf"
                maxSizeMB={5}
                preview={dniPreview}
                error={dniError}
                onChange={handleFileChange(setDniFile, setDniPreview, setDniError)}
              />

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>Atrás</Button>
                <Button onClick={() => { if (validateStep1()) setStep(2) }}>
                  Ir a pago
                </Button>
              </div>
            </div>
          )}

          {/* Paso 3: Pago + generación de voucher */}
          {step === 2 && (
            <div className="space-y-6">
              <Alert variant="info" title="Pago de inscripción">
                <p>El derecho de inscripción es de <strong>S/ 1,500.00</strong>.</p>
                <p className="mt-1">Primer mes de colegiatura <strong>GRATIS</strong>.</p>
              </Alert>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">Monto a pagar</p>
                <p className="text-4xl font-bold text-gray-900">S/ 1,500.00</p>
              </div>

              {!voucherData && (
                <Button
                  className="w-full"
                  size="lg"
                  loading={pagando}
                  onClick={handlePagar}
                >
                  {pagando ? "Procesando pago..." : "Pagar ahora"}
                </Button>
              )}

              {voucherData && (
                <div className="space-y-4">
                  <Alert variant="success" title="Pago exitoso">
                    <p>Operación: <strong>{voucherData.transaccionId}</strong></p>
                    <p className="mt-1">Monto: S/ 1,500.00 — {voucherData.fecha}</p>
                  </Alert>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Comprobante de pago (generado automáticamente)
                    </label>
                    <div className="flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <img
                        src={voucherData.voucherBase64}
                        alt="Voucher de pago"
                        className="max-w-full rounded shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                    <Button onClick={() => setStep(3)}>Revisar y enviar</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 4: Confirmación */}
          {step === 3 && voucherData && (
            <div className="space-y-4">
              <Alert variant="info" title="Resumen de tu solicitud">
                <p>Revisa todos los datos antes de enviar.</p>
              </Alert>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm space-y-2">
                <p><span className="font-medium text-gray-700">DNI:</span> {form.dni}</p>
                <p><span className="font-medium text-gray-700">Nombres:</span> {form.nombres} {form.apellidos}</p>
                <p><span className="font-medium text-gray-700">Carrera:</span> {carreras.find((c) => c.id === form.carrera_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Sede:</span> {sedes.find((s) => s.id === form.sede_id)?.nombre}</p>
                <p><span className="font-medium text-gray-700">Universidad:</span> {form.universidad}</p>
                <p>
                  <span className="font-medium text-gray-700">RENIEC:</span>{" "}
                  <span className="text-green-600">Verificado</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Pago:</span>{" "}
                  <span className="text-green-600">S/ 1,500.00 — {voucherData.transaccionId}</span>
                </p>
                {fotoPreview && (
                  <div>
                    <span className="font-medium text-gray-700">Foto:</span>{" "}
                    <img src={fotoPreview} alt="Foto" className="mt-1 inline-block h-16 w-16 rounded-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>Atrás</Button>
                <Button loading={loading} onClick={handleSubmit}>Enviar solicitud</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
