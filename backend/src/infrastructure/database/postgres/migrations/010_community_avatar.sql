-- Up Migration
ALTER TABLE categories ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Down Migration
ALTER TABLE categories DROP COLUMN IF EXISTS avatar_url;
