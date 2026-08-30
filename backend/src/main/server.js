const createApp = require('./app');
const env = require('../infrastructure/config/env');
const pool = require('../infrastructure/database/postgres/connection');

const server = createApp().listen(env.PORT, () => {
  console.log(`Member Community API đang chạy tại http://localhost:${env.PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal}: đang dừng máy chủ...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
