import {HttpParameterCodec, HttpParams} from '@angular/common/http';

export class SearchHttpParams {
  public static build(query: any): HttpParams {
    let params = new HttpParams({encoder: new CustomEncoder()});
    if (!query) {
      return params;
    }

    Object.keys(query).forEach(key => {
      const param = query[key];
      if (Array.isArray(param)) {
        param.forEach(p => {
          if (Array.isArray(p)) {
            params = p.length === 0 ? params : params.append(key, p.map(this.transformParam).join(','));
          } else {
            params = params.append(key, this.transformParam(p));
          }
        });
      } else if (param !== undefined && param !== null) {
        params = params.append(key, this.transformParam(param));
      }
    });
    return params;
  }

  private static transformParam<T>(param: T): string | number | boolean {
    if (param && Array.isArray(param)) {
      return param.join(',');
    }
    if (param && param instanceof Date) {
      return param.toISOString();
    }
    return param?.toString();
  };

}

class CustomEncoder implements HttpParameterCodec {
  //https://github.com/angular/angular/issues/18261#issuecomment-338354119

  public encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  public encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  public decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  public decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
