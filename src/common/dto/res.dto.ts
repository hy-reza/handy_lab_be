export class Res<T> {
  meta: {
    isSuccess: boolean;
    code: number;
    message: string;
    totalItems?: number;
    totalPages?: number;
    limit?: number;
    offset?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
  data?: T;
}
