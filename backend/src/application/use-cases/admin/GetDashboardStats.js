class GetDashboardStats {
  constructor({ userRepository, postRepository, commentRepository, categoryRepository }) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.commentRepository = commentRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    const [members, posts, comments, categories] = await Promise.all([
      this.userRepository.countByStatus(),
      this.postRepository.countByStatus(),
      this.commentRepository.countByStatus(),
      this.categoryRepository.count(),
    ]);
    return { members, posts, comments, categories };
  }
}

module.exports = GetDashboardStats;
