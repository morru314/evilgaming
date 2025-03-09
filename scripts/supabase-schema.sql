-- Crear tipos de roles de usuario
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user');

-- Extender la tabla de usuarios de Supabase
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Tabla para contenido (noticias, reviews, tops)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('noticia', 'review', 'top')),
  has_video BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  category TEXT,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);

-- Crear índices para búsquedas rápidas
CREATE INDEX content_type_idx ON content(content_type);
CREATE INDEX content_published_idx ON content(published);
CREATE INDEX content_created_at_idx ON content(created_at);

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer contenido publicado
CREATE POLICY "Contenido publicado visible para todos" ON content
  FOR SELECT USING (published = TRUE);

-- Solo admin y editor pueden crear contenido
CREATE POLICY "Solo admin y editor pueden crear contenido" ON content
  FOR INSERT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.role = 'admin' OR auth.users.role = 'editor')
    )
  );

-- Solo admin, editor y el autor pueden actualizar su propio contenido
CREATE POLICY "Solo admin, editor y autor pueden actualizar contenido" ON content
  FOR UPDATE TO authenticated USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.role = 'admin' OR auth.users.role = 'editor')
    )
  );

-- Solo admin puede eliminar contenido
CREATE POLICY "Solo admin puede eliminar contenido" ON content
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el campo updated_at
CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON content
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Función para asignar rol de admin al primer usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  -- Si es el primer usuario, asignar rol de admin
  IF user_count = 1 THEN
    UPDATE auth.users SET role = 'admin' WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para manejar nuevos usuarios
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

