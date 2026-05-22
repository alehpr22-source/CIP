const errorMap: Record<string, string> = {
  'Invalid login credentials': 'Credenciales inválidas',
  'Email not confirmed': 'Correo electrónico no confirmado',
  'User already registered': 'El usuario ya está registrado',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Invalid email': 'Correo electrónico inválido',
  'Too many requests': 'Demasiadas solicitudes, intenta más tarde',
  'Refresh Token Not Found': 'Sesión expirada, inicia sesión nuevamente',
  'Invalid Refresh Token': 'Sesión expirada, inicia sesión nuevamente',
  'Email rate limit exceeded': 'Demasiados intentos, intenta más tarde',
  'New email should be different from the current email': 'El nuevo correo debe ser diferente al actual',
  'Invalid email or password': 'Correo o contraseña inválidos',
  'Signup requires a valid password': 'La contraseña debe tener al menos 6 caracteres',
};

export function translateAuthError(message: string): string {
  return errorMap[message] ?? message;
}
