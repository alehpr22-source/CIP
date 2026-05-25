import { createClient } from "./server"

export async function subirArchivo(
  bucket: string,
  path: string,
  base64: string,
): Promise<string | null> {
  const supabase = createClient()

  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64
  const mimeMatch = base64.match(/^data:(.+?);/)
  const contentType = mimeMatch ? mimeMatch[1] : "image/png"

  const buffer = Buffer.from(base64Data, "base64")

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType,
    upsert: true,
  })

  if (error) {
    console.error("Error subiendo archivo a Storage:", error.message)
    return null
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl.publicUrl
}
