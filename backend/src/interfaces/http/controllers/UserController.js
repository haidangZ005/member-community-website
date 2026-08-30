function makeUserController(useCases) {
  return {
    async getMe(req, res) {
      const user = await useCases.getProfile.execute(req.user.id);
      return res.json({ data: user });
    },
    async updateMe(req, res) {
      const user = await useCases.updateProfile.execute(req.user.id, req.validatedBody);
      return res.json({ data: user });
    },
  };
}

module.exports = makeUserController;

