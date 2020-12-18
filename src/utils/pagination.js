class Pagination {
  static isValid(limit, page) {
    const defaultValue = Pagination.default();
    try {
      const newLimit = !limit ? defaultValue.limit : +limit;
      const newPage = !page ? defaultValue.page : +page;
      return {
        isValid: true,
        limit: newLimit,
        page: newPage,
      };
    } catch (e) {
      return {
        error: e,
        isValid: false,
      };
    }
  }

  static default() {
    return {
      limit: 5,
      page: 1,
    };
  }
}

module.exports = Pagination;
