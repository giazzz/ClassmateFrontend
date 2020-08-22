import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegisterService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    register(objAcc) {
        return this.http.post<any>(`${environment.apiUrl}/auth/signup`,
        objAcc, { observe: 'response' });
    }
}
