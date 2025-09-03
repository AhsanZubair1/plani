export class IPaginationOptions {
  page: number;
  limit: number;
}

export class PaginationResponse<T> {
  data: T[];
  pagination: IPaginationOptions;
  total?: number; // Optional total count
}
