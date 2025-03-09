import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

// Crear cliente de Supabase en el servidor
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "tu_clave_service_role_aqui",
)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const cookieStore = cookies()
    const supabaseToken = cookieStore.get("supabase-auth-token")?.value

    if (!supabaseToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay sesión activa",
        },
        { status: 401 },
      )
    }

    // Verificar sesión
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(supabaseToken)

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: userError?.message || "Usuario no autenticado",
        },
        { status: 401 },
      )
    }

    // Obtener contenido por ID
    const { data: content, error: contentError } = await supabaseAdmin.from("content").select("*").eq("id", id).single()

    if (contentError) {
      return NextResponse.json(
        {
          success: false,
          message: contentError.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error: any) {
    console.error("Error en API route admin/content/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const cookieStore = cookies()
    const supabaseToken = cookieStore.get("supabase-auth-token")?.value

    if (!supabaseToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay sesión activa",
        },
        { status: 401 },
      )
    }

    // Verificar sesión
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(supabaseToken)

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: userError?.message || "Usuario no autenticado",
        },
        { status: 401 },
      )
    }

    // Verificar rol de usuario
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (roleError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al verificar permisos",
        },
        { status: 403 },
      )
    }

    if (roleData.role !== "admin" && roleData.role !== "editor") {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes permisos para editar contenido",
        },
        { status: 403 },
      )
    }

    const { title, slug, description, content, image_url, type, category } = await request.json()

    // Validar datos
    if (!title || !slug || !description || !content || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan campos obligatorios",
        },
        { status: 400 },
      )
    }

    // Verificar si ya existe un slug igual (que no sea el mismo contenido)
    const { data: existingSlug, error: slugError } = await supabaseAdmin
      .from("content")
      .select("id")
      .eq("slug", slug)
      .eq("type", type)
      .neq("id", id)
      .single()

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe otro contenido con este slug. Por favor, usa uno diferente.",
        },
        { status: 400 },
      )
    }

    // Actualizar contenido
    const { data, error } = await supabaseAdmin
      .from("content")
      .update({
        title,
        slug,
        description,
        content,
        image_url,
        type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Contenido actualizado correctamente",
    })
  } catch (error: any) {
    console.error("Error en API route admin/content/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const cookieStore = cookies()
    const supabaseToken = cookieStore.get("supabase-auth-token")?.value

    if (!supabaseToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay sesión activa",
        },
        { status: 401 },
      )
    }

    // Verificar sesión
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(supabaseToken)

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: userError?.message || "Usuario no autenticado",
        },
        { status: 401 },
      )
    }

    // Verificar rol de usuario
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (roleError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al verificar permisos",
        },
        { status: 403 },
      )
    }

    if (roleData.role !== "admin" && roleData.role !== "editor") {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes permisos para eliminar contenido",
        },
        { status: 403 },
      )
    }

    // Eliminar relaciones de categorías primero
    await supabaseAdmin.from("content_categories").delete().eq("content_id", id)

    // Eliminar comentarios
    await supabaseAdmin.from("comments").delete().eq("content_id", id)

    // Eliminar contenido
    const { error } = await supabaseAdmin.from("content").delete().eq("id", id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Contenido eliminado correctamente",
    })
  } catch (error: any) {
    console.error("Error en API route admin/content/[id]:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

