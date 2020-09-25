import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassMateService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    getUserDetail(id: string) {
        let params = new HttpParams();
        params = params.append('query', id);
        return this.http.get<any>(`${environment.apiUrl}/data/user/profile`,
            { params,  observe: 'response' });
    }

    getClassDetail(id: string) {
        let params = new HttpParams();
        params = params.append('id', id);
        return this.http.get<any>(`${environment.apiUrl}/data/course/detail`,
            { params,  observe: 'response' });
    }
}
