export class SearchResult<T> {
  public data: Array<T>;
  public meta?: SearchMeta = {};

  public static empty<T>(): SearchResult<T> {
    return new SearchResult();
  }

  public static map<T, V>(results: SearchResult<T>, mapper: (t: T) => V): SearchResult<V> {
    return {
      meta: results.meta,
      data: results.data.map(mapper)
    };
  }
}

export class SearchMeta {
  public total?: number;
  public pages?: number;
  public offset?: number;
  public itemsPerPage?: number;
}

