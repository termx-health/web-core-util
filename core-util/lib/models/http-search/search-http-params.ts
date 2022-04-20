import {HttpParameterCodec, HttpParams} from '@angular/common/http';
import moment from 'moment/moment';

export class SearchHttpParams {
  public static build(query: any): HttpParams {
    let params = new HttpParams({encoder: new CustomEncoder()});
    if (!query) {
      return params;
    }
    Object.keys(query).forEach(k => {
      const param = query[k];
      if (param && typeof param.getMonth === 'function') {
        params = params.append(k, moment(param).toISOString());
      } else if (Array.isArray(param)) {
        param.forEach(p => {
          if (Array.isArray(p)) {
            params = p.length === 0 ? params : params.append(k, p.join(','));
          } else {
            params = params.append(k, p);
          }
        });
      } else if (param !== undefined && param !== null && param !== '') {
        params = params.append(k, param);
      }
    });

    return params;
  }
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
