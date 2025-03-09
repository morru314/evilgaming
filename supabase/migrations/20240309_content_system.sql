-- Agregar columna de rol a la tabla de perfiles si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
        COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: user, editor, admin';
    END IF;
END
$$;

-- Crear tabla de contenido si no existe
CREATE TABLE IF NOT EXISTS public.content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    type TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    UNIQUE(slug, type)
);

-- Comentarios para la tabla content
COMMENT ON TABLE public.content IS 'Tabla para almacenar noticias, reviews y tops';
COMMENT ON COLUMN public.content.title IS 'Título del contenido';
COMMENT ON COLUMN public.content.slug IS 'URL amigable para el contenido';
COMMENT ON COLUMN public.content.description IS 'Descripción corta del contenido';
COMMENT ON COLUMN public.content.content IS 'Contenido completo en formato texto';
COMMENT ON COLUMN public.content.image_url IS 'URL de la imagen principal';
COMMENT ON COLUMN public.content.type IS 'Tipo de contenido: noticias, reviews, tops';
COMMENT ON COLUMN public.content.author_id IS 'ID del autor del contenido';
COMMENT ON COLUMN public.content.published IS 'Indica si el contenido está publicado';

-- Crear tabla de categorías si no existe
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Comentarios para la tabla categories
COMMENT ON TABLE public.categories IS 'Categorías para clasificar el contenido';
COMMENT ON COLUMN public.categories.name IS 'Nombre de la categoría';

-- Crear tabla de relación entre contenido y categorías si no existe
CREATE TABLE IF NOT EXISTS public.content_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    UNIQUE(content_id, category_id)
);

-- Comentarios para la tabla content_categories
COMMENT ON TABLE public.content_categories IS 'Relación entre contenido y categorías';
COMMENT ON COLUMN public.content_categories.content_id IS 'ID del contenido';
COMMENT ON COLUMN public.content_categories.category_id IS 'ID de la categoría';

-- Crear tabla de comentarios si no existe
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Comentarios para la tabla comments
COMMENT ON TABLE public.comments IS 'Comentarios de los usuarios en el contenido';
COMMENT ON COLUMN public.comments.content_id IS 'ID del contenido comentado';
COMMENT ON COLUMN public.comments.user_id IS 'ID del usuario que comenta';
COMMENT ON COLUMN public.comments.comment IS 'Texto del comentario';

-- Configurar RLS para la tabla content
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla content
CREATE POLICY "Contenido visible para todos" ON public.content
    FOR SELECT USING (published = true);

CREATE POLICY "Solo administradores y editores pueden crear contenido" ON public.content
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'editor')
        )
    );

CREATE POLICY "Solo administradores, editores y el autor pueden actualizar contenido" ON public.content
    FOR UPDATE USING (
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'editor')
        )
    );

CREATE POLICY "Solo administradores y el autor pueden eliminar contenido" ON public.content
    FOR DELETE USING (
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Configurar RLS para la tabla categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla categories
CREATE POLICY "Categorías visibles para todos" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Solo administradores y editores pueden gestionar categorías" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'editor')
        )
    );

-- Configurar RLS para la tabla content_categories
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla content_categories
CREATE POLICY "Relaciones visibles para todos" ON public.content_categories
    FOR SELECT USING (true);

CREATE POLICY "Solo administradores y editores pueden gestionar relaciones" ON public.content_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'editor')
        )
    );

-- Configurar RLS para la tabla comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla comments
CREATE POLICY "Comentarios visibles para todos" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden crear comentarios" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios solo pueden editar sus propios comentarios" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios solo pueden eliminar sus propios comentarios" ON public.comments
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Asignar rol de administrador al primer usuario (opcional)
-- Descomenta y ejecuta esto manualmente si deseas asignar el rol de administrador a un usuario específico
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'ID_DEL_USUARIO';

