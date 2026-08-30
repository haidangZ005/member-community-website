const pool = require('../connection');

class PostgresRefreshTokenRepository {
  async create({ userId, tokenHash, expiresAt }) {
    const { rows } = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, tokenHash, expiresAt],
    );
    return rows[0];
  }

  async findValidByHash(tokenHash) {
    const { rows } = await pool.query(
      `SELECT * FROM refresh_tokens
       WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()`,
      [tokenHash],
    );
    return rows[0] || null;
  }

  async revokeByHash(tokenHash) {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL',
      [tokenHash],
    );
  }

  async revokeAllForUser(userId) {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL',
      [userId],
    );
  }
}

module.exports = PostgresRefreshTokenRepository;

