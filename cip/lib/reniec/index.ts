import type { ValidadorReniec } from "./api"
import { ValidadorReniecSimulado } from "./simulado"
import { ValidadorReniecProduccion } from "./produccion"

let instancia: ValidadorReniec | null = null

export function getValidadorReniec(): ValidadorReniec {
  if (!instancia) {
    const mode = process.env.RENIEC_MODE ?? "simulado"

    instancia =
      mode === "produccion"
        ? new ValidadorReniecProduccion()
        : new ValidadorReniecSimulado()
  }

  return instancia
}

export { type ValidadorReniec, type ReniecRequest, type ReniecResponse } from "./api"
