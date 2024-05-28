export default (ctx: IQuery, whereList?: string[]) => {
  const { pageSize = 10, pageIndex = 1, ...others } = ctx;
  const skip = (+pageIndex - 1) * +pageSize;

  /**排序关键词 */
  const sortKeywords = ['orderBy'];

  const where = {};
  whereList.map((w) => (where[w] = { contains: ctx[w] }));
  return {
    take: +pageSize,
    skip,
    where,
    // orderBy: { createdAt: 'asc' },
  };
};
