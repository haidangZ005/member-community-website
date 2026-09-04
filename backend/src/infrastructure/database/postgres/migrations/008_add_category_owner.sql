-- Up Migration
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_owner ON categories(owner_id);

-- Down Migration
DROP INDEX IF EXISTS idx_categories_owner;
ALTER TABLE categories DROP COLUMN IF EXISTS owner_id;
