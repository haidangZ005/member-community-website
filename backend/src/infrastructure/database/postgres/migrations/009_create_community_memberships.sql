-- Up Migration
CREATE TABLE IF NOT EXISTS community_memberships (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, category_id)
);

INSERT INTO community_memberships (user_id, category_id)
SELECT owner_id, id FROM categories WHERE owner_id IS NOT NULL
ON CONFLICT (user_id, category_id) DO NOTHING;

-- Down Migration
DROP TABLE IF EXISTS community_memberships;
