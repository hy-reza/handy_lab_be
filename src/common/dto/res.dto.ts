export class Res<T = undefined> {
  meta: {
    isSuccess: boolean;
    message: string;
    totalItems?: number;
    totalPages?: number;
    limit?: number;
    offset?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
  data?: T;
  access_token?: string;
}
