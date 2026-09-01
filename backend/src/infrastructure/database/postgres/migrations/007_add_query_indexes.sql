-- Up Migration
CREATE INDEX IF NOT EXISTS idx_users_role_created_at
  ON users(role, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_status_created_at
  ON posts(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_category_status_created_at
  ON posts(category_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_post_status_created_at
  ON comments(post_id, status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_comments_status_created_at
  ON comments(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_likes_user
  ON likes(user_id);

-- Down Migration
DROP INDEX IF EXISTS idx_likes_user;
DROP INDEX IF EXISTS idx_comments_status_created_at;
DROP INDEX IF EXISTS idx_comments_post_status_created_at;
DROP INDEX IF EXISTS idx_posts_category_status_created_at;
DROP INDEX IF EXISTS idx_posts_status_created_at;
DROP INDEX IF EXISTS idx_users_role_created_at;
