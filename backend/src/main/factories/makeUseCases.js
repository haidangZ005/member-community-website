const env = require('../../infrastructure/config/env');
const RegisterUser = require('../../application/use-cases/auth/RegisterUser');
const LoginUser = require('../../application/use-cases/auth/LoginUser');
const RefreshSession = require('../../application/use-cases/auth/RefreshSession');
const LogoutUser = require('../../application/use-cases/auth/LogoutUser');
const ForgotPassword = require('../../application/use-cases/auth/ForgotPassword');
const ResetPassword = require('../../application/use-cases/auth/ResetPassword');
const UpdateProfile = require('../../application/use-cases/auth/UpdateProfile');
const GetProfile = require('../../application/use-cases/users/GetProfile');

function makeUseCases(dependencies) {
  const { userRepository, refreshTokenRepository, resetTokenRepository, hashService, tokenService, emailService } = dependencies;
  return {
    registerUser: new RegisterUser({ userRepository, hashService }),
    loginUser: new LoginUser({ userRepository, hashService, tokenService, refreshTokenRepository }),
    refreshSession: new RefreshSession({ userRepository, tokenService, refreshTokenRepository }),
    logoutUser: new LogoutUser({ refreshTokenRepository, tokenService }),
    forgotPassword: new ForgotPassword({ userRepository, resetTokenRepository, tokenService, emailService, clientUrl: env.CLIENT_URL }),
    resetPassword: new ResetPassword({ userRepository, resetTokenRepository, refreshTokenRepository, hashService, tokenService }),
    updateProfile: new UpdateProfile({ userRepository }),
    getProfile: new GetProfile({ userRepository }),
  };
}

module.exports = makeUseCases;

