const User = require('../../../../domain/entities/User');
const pool = require('../connection');

function mapUser(row) {
  if (!row) return null;
  return new User({
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

class PostgresUserRepository {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return mapUser(rows[0]);
  }

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    return mapUser(rows[0]);
  }

  async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return mapUser(rows[0]);
  }

  async create(user) {
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.username, user.email, user.passwordHash, user.fullName, user.avatarUrl],
    );
    return mapUser(rows[0]);
  }

  async updateProfile(id, { username, fullName, avatarUrl }) {
    const { rows } = await pool.query(
      `UPDATE users SET username = COALESCE($2, username), full_name = $3, avatar_url = $4
       WHERE id = $1 RETURNING *`,
      [id, username, fullName ?? null, avatarUrl ?? null],
    );
    return mapUser(rows[0]);
  }

  async updatePassword(id, passwordHash) {
    const { rows } = await pool.query(
      'UPDATE users SET password_hash = $2 WHERE id = $1 RETURNING *',
      [id, passwordHash],
    );
    return mapUser(rows[0]);
  }
}

module.exports = PostgresUserRepository;

