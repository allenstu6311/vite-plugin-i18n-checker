export default {
  required: 'Este campo es obligatorio',
  email: 'Por favor ingresa un correo electrónico válido',
  password: {
    minLength: 'La contraseña debe tener al menos 8 caracteres',
    complexity: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales',
    mismatch: 'La confirmación de contraseña no coincide'
  },
  phone: 'Por favor ingresa un número de teléfono válido',
  url: 'Por favor ingresa una URL válida',
  date: 'Por favor ingresa una fecha válida',
  number: {
    min: 'El valor no puede ser menor que {min}',
    max: 'El valor no puede ser mayor que {max}',
    integer: 'Por favor ingresa un número entero'
  },
  file: {
    maxSize: 'El tamaño del archivo no puede exceder {size}MB',
    allowedTypes: 'Solo se permiten archivos en formato {types}',
    required: 'Por favor selecciona un archivo'
  },
  array: {
    minLength: 'Se requieren al menos {min} elementos',
    maxLength: 'Se permiten máximo {max} elementos'
  }
}