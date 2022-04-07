
export class SearchResult<T> {
  data: Array<T>;
  meta?: SearchMeta = {};

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
  total?: number;
  pages?: number;
  offset?: number;
  itemsPerPage?: number;
}

