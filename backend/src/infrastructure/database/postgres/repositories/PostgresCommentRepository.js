const Comment = require('../../../../domain/entities/Comment');
const pool = require('../connection');

function mapComment(row) {
  if (!row) return null;
  return new Comment({
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    content: row.content,
    status: row.status,
    author: row.author_username ? {
      id: row.author_id,
      username: row.author_username,
      fullName: row.author_full_name,
      avatarUrl: row.author_avatar_url,
    } : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

const selectComment = `
  SELECT cm.*, u.username AS author_username, u.full_name AS author_full_name, u.avatar_url AS author_avatar_url
  FROM comments cm JOIN users u ON u.id = cm.author_id`;

class PostgresCommentRepository {
  async create(comment) {
    const { rows } = await pool.query(
      'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING id',
      [comment.postId, comment.authorId, comment.content],
    );
    const result = await pool.query(`${selectComment} WHERE cm.id = $1`, [rows[0].id]);
    return mapComment(result.rows[0]);
  }

  async listByPost(postId) {
    const { rows } = await pool.query(
      `${selectComment} WHERE cm.post_id = $1 AND cm.status = 'visible' ORDER BY cm.created_at ASC`,
      [postId],
    );
    return rows.map(mapComment);
  }
}

module.exports = PostgresCommentRepository;
