class ListCategories {
  constructor({ categoryRepository }) { this.categoryRepository = categoryRepository; }

  async execute() {
    return (await this.categoryRepository.list()).map((category) => category.toJSON());
  }
}

module.exports = ListCategories;
