import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

// Crear cliente de Supabase en el servidor
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "tu_clave_service_role_aqui",
)

export async function POST(request: Request) {
  try {
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
          message: "No tienes permisos para crear contenido",
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

    // Verificar si ya existe un slug igual
    const { data: existingSlug, error: slugError } = await supabaseAdmin
      .from("content")
      .select("id")
      .eq("slug", slug)
      .eq("type", type)
      .single()

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya existe contenido con este slug. Por favor, usa uno diferente.",
        },
        { status: 400 },
      )
    }

    // Crear contenido
    const { data, error } = await supabaseAdmin.from("content").insert([
      {
        title,
        slug,
        description,
        content,
        image_url,
        type,
        author_id: userData.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      )
    }

    // Si hay categoría, crear relación
    if (category) {
      // Primero verificar si la categoría existe
      const { data: categoryData, error: categoryError } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("name", category)
        .single()

      let categoryId

      if (categoryError || !categoryData) {
        // Crear categoría si no existe
        const { data: newCategory, error: newCategoryError } = await supabaseAdmin
          .from("categories")
          .insert([
            {
              name: category,
              created_at: new Date().toISOString(),
            },
          ])
          .select()

        if (newCategoryError) {
          console.error("Error al crear categoría:", newCategoryError)
        } else {
          categoryId = newCategory[0].id
        }
      } else {
        categoryId = categoryData.id
      }

      // Crear relación si tenemos categoryId
      if (categoryId) {
        const { error: relationError } = await supabaseAdmin.from("content_categories").insert([
          {
            content_id: data[0].id,
            category_id: categoryId,
          },
        ])

        if (relationError) {
          console.error("Error al crear relación de categoría:", relationError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Contenido creado correctamente",
      id: data[0].id,
    })
  } catch (error: any) {
    console.error("Error en API route admin/content/create:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

