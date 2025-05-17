export interface IPage<T> {
  content?: T[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export class PageRequest {
  size?: number;
  page?: number;
  sort?: string[];

  constructor(size = 20, page = 0, sort: string[] | undefined = undefined) {
    this.size = size;
    this.page = page;
    this.sort = sort;
  }

  static default(): PageRequest {
    return new PageRequest();
  }

  static of(params: Partial<PageRequest>): PageRequest {
    const { size = 20, page = 0, sort = [] } = params;
    return new PageRequest(size, page, sort);
  }
}

