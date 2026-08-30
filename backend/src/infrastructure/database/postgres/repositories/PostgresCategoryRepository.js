const pool = require('../connection');

class PostgresCategoryRepository {
  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, description, created_at AS "createdAt", updated_at AS "updatedAt" FROM categories WHERE id = $1',
      [id],
    );
    return rows[0] || null;
  }

  async list() {
    const { rows } = await pool.query(
      'SELECT id, name, description, created_at AS "createdAt", updated_at AS "updatedAt" FROM categories ORDER BY name ASC',
    );
    return rows;
  }
}

module.exports = PostgresCategoryRepository;
