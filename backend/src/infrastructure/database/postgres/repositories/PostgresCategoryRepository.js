const pool = require('../connection');
const Category = require('../../../../domain/entities/Category');

function mapCategory(row) {
  if (!row) return null;
  return new Category({
    id: row.id,
    name: row.name,
    description: row.description,
    avatarUrl: row.avatar_url ?? row.avatarUrl ?? null,
    ownerId: row.owner_id ?? row.ownerId,
    joinedByCurrentUser: row.joined_by_current_user ?? row.joinedByCurrentUser,
    favoriteByCurrentUser: row.favorite_by_current_user ?? row.favoriteByCurrentUser,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  });
}

class PostgresCategoryRepository {
  async findById(id, viewerId = null) {
    const { rows } = await pool.query(
      `SELECT c.id, c.name, c.description, c.avatar_url, c.owner_id AS "ownerId", c.created_at AS "createdAt", c.updated_at AS "updatedAt",
              (cm.user_id IS NOT NULL) AS "joinedByCurrentUser", COALESCE(cm.is_favorite, FALSE) AS "favoriteByCurrentUser"
       FROM categories c
       LEFT JOIN community_memberships cm ON cm.category_id = c.id AND cm.user_id = $2::uuid
       WHERE c.id = $1`,
      [id, viewerId],
    );
    return mapCategory(rows[0]);
  }

  async list({ search = '', limit = null, ownerId = null, viewerId = null, joinedOnly = false, favoritesOnly = false } = {}) {
    const { rows } = await pool.query(
      `SELECT c.id, c.name, c.description, c.avatar_url, c.owner_id AS "ownerId", c.created_at AS "createdAt", c.updated_at AS "updatedAt",
              (cm.user_id IS NOT NULL) AS "joinedByCurrentUser", COALESCE(cm.is_favorite, FALSE) AS "favoriteByCurrentUser"
       FROM categories c
       LEFT JOIN community_memberships cm ON cm.category_id = c.id AND cm.user_id = $5::uuid
       WHERE ($1 = '' OR c.name ILIKE $2)
         AND ($4::uuid IS NULL OR c.owner_id = $4)
         AND ($6::boolean = FALSE OR cm.user_id IS NOT NULL)
         AND ($7::boolean = FALSE OR cm.is_favorite = TRUE)
       ORDER BY COALESCE(cm.is_favorite, FALSE) DESC, c.name ASC
       LIMIT $3`,
      [search, `%${search}%`, limit, ownerId, viewerId, joinedOnly, favoritesOnly],
    );
    return rows.map(mapCategory);
  }

  async findByName(name) {
    const { rows } = await pool.query('SELECT * FROM categories WHERE LOWER(name) = LOWER($1)', [name]);
    return mapCategory(rows[0]);
  }

  async create(category) {
    const { rows } = await pool.query(
      `WITH created AS (
         INSERT INTO categories (name, description, owner_id, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *
       ), joined AS (
         INSERT INTO community_memberships (user_id, category_id)
         SELECT owner_id, id FROM created WHERE owner_id IS NOT NULL
       )
       SELECT * FROM created`,
      [category.name, category.description, category.ownerId, category.avatarUrl],
    );
    return this.findById(rows[0].id, category.ownerId);
  }

  async update(id, category) {
    const { rows } = await pool.query(
      'UPDATE categories SET name = $2, description = $3, avatar_url = $4 WHERE id = $1 RETURNING *',
      [id, category.name, category.description, category.avatarUrl],
    );
    return mapCategory(rows[0]);
  }

  async remove(id) {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  }

  async join(categoryId, userId) {
    await pool.query(
      'INSERT INTO community_memberships (user_id, category_id) VALUES ($1, $2) ON CONFLICT (user_id, category_id) DO NOTHING',
      [userId, categoryId],
    );
    return this.findById(categoryId, userId);
  }

  async leave(categoryId, userId) {
    await pool.query('DELETE FROM community_memberships WHERE user_id = $1 AND category_id = $2', [userId, categoryId]);
    return this.findById(categoryId, userId);
  }

  async setFavorite(categoryId, userId, favorite) {
    if (favorite) {
      await pool.query(
        `INSERT INTO community_memberships (user_id, category_id, is_favorite) VALUES ($1, $2, TRUE)
         ON CONFLICT (user_id, category_id) DO UPDATE SET is_favorite = TRUE`,
        [userId, categoryId],
      );
    } else {
      await pool.query('UPDATE community_memberships SET is_favorite = FALSE WHERE user_id = $1 AND category_id = $2', [userId, categoryId]);
    }
    return this.findById(categoryId, userId);
  }

  async count() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM categories');
    return rows[0].count;
  }
}

module.exports = PostgresCategoryRepository;
