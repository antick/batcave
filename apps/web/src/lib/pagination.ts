export interface PageLink {
  page: number;
  href: string;
  label: string;
  current: boolean;
}

export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  pageSize: number,
): PaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage: safePage,
    totalPages,
    totalItems: items.length,
  };
}

export function getPagePath(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

export function getPaginatedPaths(
  basePath: string,
  totalPages: number,
): string[] {
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
    getPagePath(basePath, index + 2),
  );
}

export function getPaginationLinks(
  basePath: string,
  currentPage: number,
  totalPages: number,
): PageLink[] {
  return Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;

    return {
      page,
      href: getPagePath(basePath, page),
      label: `Page ${page}`,
      current: page === currentPage,
    };
  });
}
