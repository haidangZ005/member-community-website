const nodemailer = require('nodemailer');
const env = require('../config/env');

class NodemailerEmailService {
  constructor() {
    this.transport = env.SMTP_HOST
      ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      })
      : nodemailer.createTransport({ jsonTransport: true });
  }

  async sendPasswordReset({ email, fullName, resetUrl }) {
    return this.transport.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Đặt lại mật khẩu Common Ground',
      text: `Xin chào ${fullName || 'bạn'}, mở liên kết sau để đặt lại mật khẩu (hiệu lực 30 phút): ${resetUrl}`,
    });
  }
}

module.exports = NodemailerEmailService;
