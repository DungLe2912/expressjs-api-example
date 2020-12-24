class Pagination {
  static paginate(limit, page) {
    const defaultValue = Pagination.default();
    const newLimit = !limit ? defaultValue.limit : +limit;
    const newPage = !page ? defaultValue.page : +page;
    return {
      limit: newLimit,
      page: newPage,
    };
  }

  static default() {
    return {
      limit: 5,
      page: 1,
    };
  }
}

module.exports = Pagination;
