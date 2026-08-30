const makeUseCases = require('../../../../src/main/factories/makeUseCases');
const { makeFakeDependencies } = require('../../../helpers/fakes');

describe('Sprint 1 auth use cases', () => {
  let dependencies;
  let useCases;

  beforeEach(() => {
    dependencies = makeFakeDependencies();
    useCases = makeUseCases(dependencies);
  });

  async function register() {
    return useCases.registerUser.execute({ username: 'minhanh', email: 'anh@example.com', password: 'Matkhau123', fullName: 'Minh Anh' });
  }

  test('RegisterUser tạo member và không trả password hash', async () => {
    const user = await register();
    expect(user).toMatchObject({ username: 'minhanh', email: 'anh@example.com', role: 'member', status: 'active' });
    expect(user.passwordHash).toBeUndefined();
  });

  test('RegisterUser từ chối email trùng', async () => {
    await register();
    await expect(useCases.registerUser.execute({ username: 'nguoikhac', email: 'anh@example.com', password: 'Matkhau123' })).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  test('LoginUser cấp access và refresh token', async () => {
    await register();
    const session = await useCases.loginUser.execute({ email: 'anh@example.com', password: 'Matkhau123' });
    expect(session.accessToken).toBeTruthy();
    expect(session.refreshToken).toBeTruthy();
    expect(dependencies.refreshTokenRepository.tokens).toHaveLength(1);
  });

  test('LoginUser từ chối mật khẩu sai', async () => {
    await register();
    await expect(useCases.loginUser.execute({ email: 'anh@example.com', password: 'sai' })).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  test('RefreshSession xoay vòng refresh token', async () => {
    await register();
    const first = await useCases.loginUser.execute({ email: 'anh@example.com', password: 'Matkhau123' });
    const next = await useCases.refreshSession.execute(first.refreshToken);
    expect(next.refreshToken).not.toBe(first.refreshToken);
    await expect(useCases.refreshSession.execute(first.refreshToken)).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  test('LogoutUser thu hồi refresh token', async () => {
    await register();
    const session = await useCases.loginUser.execute({ email: 'anh@example.com', password: 'Matkhau123' });
    await useCases.logoutUser.execute(session.refreshToken);
    await expect(useCases.refreshSession.execute(session.refreshToken)).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  test('ForgotPassword không làm lộ email và gửi link cho tài khoản hợp lệ', async () => {
    await register();
    await expect(useCases.forgotPassword.execute({ email: 'khongco@example.com' })).resolves.toBeUndefined();
    await useCases.forgotPassword.execute({ email: 'anh@example.com' });
    expect(dependencies.emailService.messages[0].resetUrl).toContain('/reset-password?token=');
  });

  test('ResetPassword đổi mật khẩu, dùng token một lần và thu hồi phiên cũ', async () => {
    await register();
    const session = await useCases.loginUser.execute({ email: 'anh@example.com', password: 'Matkhau123' });
    await useCases.forgotPassword.execute({ email: 'anh@example.com' });
    const token = dependencies.tokenService.lastOpaqueToken;
    await useCases.resetPassword.execute({ token, password: 'Matkhau456' });
    await expect(useCases.loginUser.execute({ email: 'anh@example.com', password: 'Matkhau456' })).resolves.toHaveProperty('accessToken');
    await expect(useCases.refreshSession.execute(session.refreshToken)).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    await expect(useCases.resetPassword.execute({ token, password: 'Matkhau789' })).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  test('GetProfile và UpdateProfile trả dữ liệu công khai', async () => {
    const registered = await register();
    const updated = await useCases.updateProfile.execute(registered.id, { username: 'minhanh_new', fullName: 'Minh Anh Mới', avatarUrl: '' });
    expect(updated).toMatchObject({ username: 'minhanh_new', fullName: 'Minh Anh Mới' });
    await expect(useCases.getProfile.execute(registered.id)).resolves.toMatchObject({ email: 'anh@example.com' });
  });
});

