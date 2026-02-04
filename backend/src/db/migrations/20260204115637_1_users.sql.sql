CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
    name TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
