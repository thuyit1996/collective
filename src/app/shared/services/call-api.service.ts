import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import qs from 'qs';
@Injectable()

export class CallApiService {
  constructor(
    private http: HttpClient,
  ) {
  }
  callApiQueryString(url, body?: any) {

    return this.http.post(`${environment.API_ENDPOINT}/${url}`, qs.stringify(body)).pipe(
      map((data: any) => data),
    );
  }
  callApiPost(url: string, body?: any) {
    return this.http.post(`${environment.API_ENDPOINT}/${url}`, body).pipe(
      map((data: any) => data),
    );
  }
  callApiGet(url: string, body?: any) {
    return this.http.get(`${environment.API_ENDPOINT}/${url}`, body).pipe(
      map((data: any) => data),
    );
  }
  callApiPut(url: string, body?: any) {
    return this.http.put(`${environment.API_ENDPOINT}/${url}`, body).pipe(
      map((data: any) => data),
    );
  }
  callApiDelete(url: string, body?: any) {
    return this.http.delete(`${environment.API_ENDPOINT}/${url}`, body).pipe(
      map((data: any) => data),
    );
  }
}
