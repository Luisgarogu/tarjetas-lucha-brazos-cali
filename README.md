<<<<<<< HEAD
# tarjetas-lucha-brazos-cali
=======
# Armwrestling Cali

Plataforma de credenciales deportivas digitales para Lucha Brazos Cali. Incluye home pública, credenciales por URL, administración protegida e importación validada desde Excel, sin base de datos.

## Stack

Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Zod, SheetJS (`xlsx`) y `clsx`. Los datos versionados viven en `src/data/cards.json`.

## Instalación y ejecución

Requiere Node.js 18.17 o superior.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Una credencial de ejemplo está en `/credencial/ent-0001`; el acceso administrativo está en `/admin/login`.

Comandos disponibles:

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Variables de entorno

Obligatorias para administración:

- `ADMIN_USER`: usuario administrador.
- `ADMIN_PASSWORD`: contraseña; use un valor largo y único.
- `ADMIN_SESSION_SECRET`: secreto largo y aleatorio para firmar la cookie HMAC.

Opcionales en producción para persistir mediante GitHub:

- `GITHUB_TOKEN`: token fine-grained con permiso **Contents: Read and write** sobre el repositorio.
- `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`.
- `GITHUB_CARDS_PATH` (por defecto `src/data/cards.json`).

Consulte `.env.example`. Ningún secreto usa el prefijo `NEXT_PUBLIC_` ni llega al navegador.

## Formato del Excel

La primera hoja debe contener estos encabezados. Se normalizan mayúsculas, minúsculas, tildes y espacios:

| Columna | Regla |
|---|---|
| `id` | Obligatorio, único; letras, números, guion o guion bajo |
| `cedula` | Obligatoria |
| `nombre_completo` | Obligatorio |
| `fecha_nacimiento` | `YYYY-MM-DD` o fecha nativa de Excel |
| `peso_kg`, `estatura_cm` | Números positivos |
| `anio_ingreso` | Año entero |
| `estado` | activo, inactivo, active, inactive |
| `rol` | entrenador, deportista, integrante, miembro, director, asistente, coach, athlete, member, other |
| `rol_personalizado` | Opcional |
| `foto_url` | Opcional; por defecto `/people/{id}.webp` |

Si una fila falla, no se actualiza ningún dato y el dashboard muestra los errores. La categoría nunca se importa.

## Categorías por peso

`≤65: -65 KG`; `≤70: -70 KG`; `≤75: -75 KG`; `≤80: -80 KG`; `≤90: -90 KG`; `≤100: -100 KG`; `>100: +100 KG`.

## Imágenes

Coloque imágenes WebP en `public/people/{id}.webp`, o use una URL HTTPS en `foto_url`. Si una imagen falta, la tarjeta muestra un placeholder con iniciales.

## Despliegue en Vercel y persistencia

1. Importe el repositorio en Vercel.
2. Configure las variables de administración.
3. Configure las cinco variables de GitHub si quiere actualizar tarjetas desde producción.
4. Despliegue con el comando de build predeterminado `npm run build`.

En desarrollo, la importación escribe directamente `src/data/cards.json`. En Vercel el filesystem no es persistente: la API obtiene el SHA actual y crea un commit mediante la API de contenidos de GitHub. El commit debe activar un nuevo despliegue de Vercel; hasta completarse ese despliegue, la versión publicada seguirá sirviendo el JSON anterior.

## Riesgos y limitaciones

- No hay base de datos ni edición concurrente; dos cargas simultáneas pueden competir por el SHA de GitHub.
- La sesión dura ocho horas y no dispone de revocación centralizada.
- Cambiar el JSON en desarrollo puede requerir reiniciar o recargar el servidor para invalidar módulos.
- Las cédulas se guardan completas en Git, aunque la UI las enmascara. Antes de uso real, revise consentimiento, acceso al repositorio, retención y normativa colombiana de datos personales.
- Para una aplicación de alto tráfico, autenticación multiusuario, auditoría o actualización inmediata, conviene migrar a almacenamiento persistente administrado.
>>>>>>> 533126b (Initial MVP tarjetas deportivas LBC)
