const pool = require('../connection');

class PostgresPasswordResetTokenRepository {
  async create({ userId, tokenHash, expiresAt }) {
    const { rows } = await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, tokenHash, expiresAt],
    );
    return this.mapToken(rows[0]);
  }

  async findValidByHash(tokenHash) {
    const { rows } = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()`,
      [tokenHash],
    );
    return this.mapToken(rows[0]);
  }

  async markUsed(id) {
    await pool.query('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [id]);
  }

  async invalidateForUser(userId) {
    await pool.query(
      'UPDATE password_reset_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL',
      [userId],
    );
  }

  mapToken(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdAt: row.created_at,
    };
  }
}

module.exports = PostgresPasswordResetTokenRepository;
