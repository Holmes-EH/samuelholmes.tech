CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    title TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL,
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
