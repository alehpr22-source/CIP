export type ReniecResult = {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  foto?: string;
};

const RENIEC_MOCK_DATA: Record<string, ReniecResult> = {
  '12345678': {
    nombres: 'JUAN CARLOS',
    apellido_paterno: 'PEREZ',
    apellido_materno: 'LOPEZ',
  },
  '87654321': {
    nombres: 'MARIA ELENA',
    apellido_paterno: 'RAMIREZ',
    apellido_materno: 'QUISPE',
  },
};

export async function consultarReniecMock(
  dni: string
): Promise<ReniecResult | null> {
  if (!/^\d{8}$/.test(dni)) {
    return null;
  }

  await new Promise((resolve) => setTimeout(resolve, 700));

  return RENIEC_MOCK_DATA[dni] ?? {
    nombres: 'JUAN CARLOS',
    apellido_paterno: 'PEREZ',
    apellido_materno: 'LOPEZ',
  };
}
