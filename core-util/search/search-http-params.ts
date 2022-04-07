import {HttpParameterCodec, HttpParams} from '@angular/common/http';
import * as moment from 'moment';

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

  private static toIsoDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }
}

class CustomEncoder implements HttpParameterCodec {
  //https://github.com/angular/angular/issues/18261#issuecomment-338354119

  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
