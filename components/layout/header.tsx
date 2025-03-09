"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, User, FileText } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          My App
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-red-500">
                  <FileText className="h-5 w-5 mr-2" />
                  Panel Admin
                </Button>
              </Link>
              <Link href="/perfil">
                <Button variant="ghost" className="text-white hover:text-red-500">
                  <User className="h-5 w-5 mr-2" />
                  Perfil
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/auth/server-auth">
                <Button variant="ghost" className="text-white hover:text-red-500">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/server-auth?tab=register">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Registrarse</Button>
              </Link>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gray-900 text-white">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigate through the app.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
              {user ? (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" className="text-white hover:text-red-500 w-full justify-start">
                      <FileText className="h-5 w-5 mr-2" />
                      Panel Admin
                    </Button>
                  </Link>
                  <Link href="/perfil">
                    <Button variant="ghost" className="text-white hover:text-red-500 w-full justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Perfil
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/server-auth">
                    <Button variant="ghost" className="text-white hover:text-red-500 w-full justify-start">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/auth/server-auth?tab=register">
                    <Button className="bg-red-600 hover:bg-red-700 text-white w-full">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

