import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    createSession(objSession) {
        return this.http.post<any>(`${environment.apiUrl}/data/session/add`,
        objSession, { observe: 'response' });
    }

    updateStatusToGoing(session_id) {
        return this.http.post<any>(`http://192.168.31.178:8080/api/data/session/updateStatus?id=${session_id}&status=ONGOING`,
            { observe: 'response' });
    }

    startAttendandeCheck(session_id) {
        return this.http.post<any>(`${environment.apiUrl}/data/session/startAttendandeCheck?id=${session_id}`,
            { observe: 'response' });
    }

    closeAttendanceCheck(session_id) {
        return this.http.post<any>(`${environment.apiUrl}/data/session/closeAttendanceCheck?id=${session_id}`,
            { observe: 'response' });
    }

}
