import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {SearchHttpParams} from '../search/search-http-params';
import {Observable} from 'rxjs';

export class Resty<T> {
  constructor(public http: HttpClient, public baseUrl: string) { }

  public save(data: {id: number}): Observable<any> {
    if (data.id) {
      return this.http.put(`${this.baseUrl}/${data.id}`, data);
    } else {
      return this.http.post(`${this.baseUrl}`, data);
    }
  }

  public search(query: any): Observable<any> {
    return this.http.get<T[]>(`${this.baseUrl}`, {params: SearchHttpParams.build(query)});
  }

  public get(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(map(resp => resp as T));
  }
}
