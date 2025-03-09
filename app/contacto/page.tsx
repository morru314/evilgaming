import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactoPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-[#3c1518] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CONTACTO</h1>
          <p className="text-xl text-gray-300">
            ¿Tienes alguna pregunta, sugerencia o propuesta? Estamos aquí para escucharte. Ponte en contacto con nuestro
            equipo y te responderemos lo antes posible.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulario de contacto */}
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tu nombre"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="tu@email.com"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  id="asunto"
                  placeholder="Asunto de tu mensaje"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium mb-2">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-red-600 p-3 rounded-lg mr-4">
                  <Mail className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">info@evilgaming.com</p>
                  <p className="text-gray-400">soporte@evilgaming.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-600 p-3 rounded-lg mr-4">
                  <MapPin className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ubicación</h3>
                  <p className="text-gray-400">Calle Falsa 123</p>
                  <p className="text-gray-400">28001, Madrid, España</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-600 p-3 rounded-lg mr-4">
                  <Phone className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Teléfono</h3>
                  <p className="text-gray-400">+34 91 123 45 67</p>
                  <p className="text-gray-400">Lun-Vie: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-12 mb-4">Síguenos en redes sociales</h3>
            <div className="flex space-x-4">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              </a>
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

