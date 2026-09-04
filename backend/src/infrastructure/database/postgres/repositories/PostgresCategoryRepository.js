const pool = require('../connection');
const Category = require('../../../../domain/entities/Category');

function mapCategory(row) {
  if (!row) return null;
  return new Category({
    id: row.id,
    name: row.name,
    description: row.description,
    ownerId: row.owner_id ?? row.ownerId,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  });
}

class PostgresCategoryRepository {
  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, description, owner_id AS "ownerId", created_at AS "createdAt", updated_at AS "updatedAt" FROM categories WHERE id = $1',
      [id],
    );
    return mapCategory(rows[0]);
  }

  async list({ search = '', limit = null, ownerId = null } = {}) {
    const { rows } = await pool.query(
      `SELECT id, name, description, owner_id AS "ownerId", created_at AS "createdAt", updated_at AS "updatedAt"
       FROM categories
       WHERE ($1 = '' OR name ILIKE $2)
         AND ($4::uuid IS NULL OR owner_id = $4)
       ORDER BY name ASC
       LIMIT $3`,
      [search, `%${search}%`, limit, ownerId],
    );
    return rows.map(mapCategory);
  }

  async findByName(name) {
    const { rows } = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [name]);
    return mapCategory(rows[0]);
  }

  async create(category) {
    const { rows } = await pool.query(
      'INSERT INTO categories (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [category.name, category.description, category.ownerId],
    );
    return mapCategory(rows[0]);
  }

  async update(id, category) {
    const { rows } = await pool.query(
      'UPDATE categories SET name = $2, description = $3 WHERE id = $1 RETURNING *',
      [id, category.name, category.description],
    );
    return mapCategory(rows[0]);
  }

  async remove(id) {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  }

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM categories');
    return rows[0].count;
  }
}

module.exports = PostgresCategoryRepository;
