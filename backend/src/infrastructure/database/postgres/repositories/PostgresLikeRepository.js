const pool = require('../connection');

class PostgresLikeRepository {
  async create(postId, userId) {
    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT (post_id, user_id) DO NOTHING',
      [postId, userId],
    );
  }

  async remove(postId, userId) {
    await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
  }

  async countByPost(postId) {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1', [postId]);
    return rows[0].count;
  }
}

module.exports = PostgresLikeRepository;
