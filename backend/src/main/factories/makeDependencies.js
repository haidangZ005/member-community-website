const PostgresUserRepository = require('../../infrastructure/database/postgres/repositories/PostgresUserRepository');
const PostgresRefreshTokenRepository = require('../../infrastructure/database/postgres/repositories/PostgresRefreshTokenRepository');
const PostgresPasswordResetTokenRepository = require('../../infrastructure/database/postgres/repositories/PostgresPasswordResetTokenRepository');
const BcryptHashService = require('../../infrastructure/services/BcryptHashService');
const JwtTokenService = require('../../infrastructure/services/JwtTokenService');
const NodemailerEmailService = require('../../infrastructure/services/NodemailerEmailService');

function makeDependencies() {
  return {
    userRepository: new PostgresUserRepository(),
    refreshTokenRepository: new PostgresRefreshTokenRepository(),
    resetTokenRepository: new PostgresPasswordResetTokenRepository(),
    hashService: new BcryptHashService(),
    tokenService: new JwtTokenService(),
    emailService: new NodemailerEmailService(),
  };
}

module.exports = makeDependencies;

