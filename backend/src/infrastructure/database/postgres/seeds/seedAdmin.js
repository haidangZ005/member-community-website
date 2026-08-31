const pool = require('../connection');
const env = require('../../../config/env');
const BcryptHashService = require('../../../services/BcryptHashService');

async function seedAdmin() {
  const { ADMIN_EMAIL: email, ADMIN_USERNAME: username, ADMIN_PASSWORD: password } = env;
  if (!email || !username || !password) {
    throw new Error('Cần cấu hình ADMIN_EMAIL, ADMIN_USERNAME và ADMIN_PASSWORD');
  }
  if (!/^[a-zA-Z0-9_]{3,50}$/.test(username) || password.length < 8) {
    throw new Error('ADMIN_USERNAME hoặc ADMIN_PASSWORD không hợp lệ');
  }

  const passwordHash = await new BcryptHashService().hash(password);
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, password_hash, full_name, role, status)
     VALUES ($1, $2, $3, 'Quản trị viên', 'admin', 'active')
     ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username,
       password_hash = EXCLUDED.password_hash, role = 'admin', status = 'active'
     RETURNING email, username`,
    [username, email.trim().toLowerCase(), passwordHash],
  );
  console.log(`Đã sẵn sàng tài khoản admin: ${rows[0].email} (${rows[0].username})`);
}

seedAdmin()
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(() => pool.end());
