const Post = require('../../../../domain/entities/Post');
const pool = require('../connection');

function mapPost(row) {
  if (!row) return null;
  return new Post({
    id: row.id,
    authorId: row.author_id,
    categoryId: row.category_id,
    title: row.title,
    content: row.content,
    status: row.status,
    author: row.author_username ? {
      id: row.author_id,
      username: row.author_username,
      fullName: row.author_full_name,
      avatarUrl: row.author_avatar_url,
    } : null,
    category: row.category_id ? { id: row.category_id, name: row.category_name } : null,
    likeCount: row.like_count,
    commentCount: row.comment_count,
    likedByCurrentUser: row.liked_by_current_user,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

const baseSelect = `
  SELECT p.*, u.username AS author_username, u.full_name AS author_full_name,
    u.avatar_url AS author_avatar_url, c.name AS category_name,
    (SELECT COUNT(*)::int FROM likes l WHERE l.post_id = p.id) AS like_count,
    (SELECT COUNT(*)::int FROM comments cm WHERE cm.post_id = p.id AND cm.status = 'visible') AS comment_count,
    EXISTS(SELECT 1 FROM likes mine WHERE mine.post_id = p.id AND mine.user_id = $1) AS liked_by_current_user
  FROM posts p
  JOIN users u ON u.id = p.author_id
  LEFT JOIN categories c ON c.id = p.category_id`;

class PostgresPostRepository {
  async create(post) {
    const { rows } = await pool.query(
      `INSERT INTO posts (author_id, category_id, title, content)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [post.authorId, post.categoryId, post.title, post.content],
    );
    return this.findById(rows[0].id, post.authorId);
  }

  async list({ page, limit, categoryId, viewerId }) {
    const offset = (page - 1) * limit;
    const params = [viewerId, categoryId, limit, offset];
    const [itemsResult, countResult] = await Promise.all([
      pool.query(
        `${baseSelect}
         WHERE p.status = 'published' AND ($2::uuid IS NULL OR p.category_id = $2)
         ORDER BY p.created_at DESC LIMIT $3 OFFSET $4`,
        params,
      ),
      pool.query(
        `SELECT COUNT(*)::int AS total FROM posts
         WHERE status = 'published' AND ($1::uuid IS NULL OR category_id = $1)`,
        [categoryId],
      ),
    ]);
    return { items: itemsResult.rows.map(mapPost), total: countResult.rows[0].total };
  }

  async findById(id, viewerId = null) {
    const { rows } = await pool.query(`${baseSelect} WHERE p.id = $2`, [viewerId, id]);
    return mapPost(rows[0]);
  }

  async update(id, changes, viewerId = null) {
    await pool.query(
      `UPDATE posts SET title = COALESCE($2, title), content = COALESCE($3, content),
       category_id = CASE WHEN $4 THEN $5::uuid ELSE category_id END WHERE id = $1`,
      [id, changes.title, changes.content, Object.prototype.hasOwnProperty.call(changes, 'categoryId'), changes.categoryId],
    );
    return this.findById(id, viewerId);
  }

  async remove(id) {
    await pool.query("UPDATE posts SET status = 'removed' WHERE id = $1", [id]);
  }
}

module.exports = PostgresPostRepository;
