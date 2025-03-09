"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
          <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error en la aplicación</h2>
            <p className="text-gray-300 mb-6">
              Ha ocurrido un error en el servidor. Esto podría deberse a un problema de configuración o conexión.
            </p>
            {error?.digest && <p className="text-sm text-gray-400 mb-6">Código de error: {error.digest}</p>}
            <div className="flex flex-col space-y-4">
              <button onClick={reset} className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md">
                Intentar de nuevo
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="py-2 px-4 bg-transparent border border-gray-600 text-white rounded-md"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

