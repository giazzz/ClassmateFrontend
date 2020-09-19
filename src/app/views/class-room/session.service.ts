import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassRoomService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    createSession(objSession) {
        return this.http.post<any>(`${environment.apiUrl}/data/session/add`,
        objSession, { observe: 'response' });
    }

    // createSession(objSession) {
    //     return this.http.post<any>(`${environment.apiUrl}/data/session/add`,
    //     objSession, { observe: 'response' });
    // }

}
