const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export class QueryParams {
  public sort?: string | string[];
  public limit?: number = DEFAULT_LIMIT;
  public offset?: number = DEFAULT_OFFSET;
  public page?: number;

  public constructor() {
    Object.defineProperty(this, 'page', {
      get: () => {
        return (this.offset || DEFAULT_OFFSET) / (this.limit || DEFAULT_LIMIT) + 1;
      },
      set: (page: number) => {
        this.offset = (page - 1) * (this.limit || DEFAULT_LIMIT);
      }
    });
  }
}
