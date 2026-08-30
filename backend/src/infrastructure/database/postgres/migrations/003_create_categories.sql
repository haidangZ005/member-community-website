-- Up Migration
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO categories (name, description) VALUES
  ('Hỏi đáp', 'Cùng nhau giải đáp những điều còn băn khoăn'),
  ('Chia sẻ', 'Câu chuyện, kinh nghiệm và góc nhìn từ thành viên'),
  ('Dự án', 'Cập nhật dự án và tìm cộng sự')
ON CONFLICT (name) DO NOTHING;

-- Down Migration
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
DROP TABLE IF EXISTS categories;
