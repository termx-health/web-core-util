export class QueryParams {
  public sort?: string | string[];
  public limit?: number = 20;
  public offset?: number = 0;

  constructor() {
    Object.defineProperty(this, 'page', {
      get: () => {
        return this.offset / this.limit + 1;
      },
      set: (page: number) => {
        this.offset = (page - 1) * this.limit;
      }
    });
  }

}
