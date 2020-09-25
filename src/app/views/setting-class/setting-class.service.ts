import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingClassService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    generateCourseToken(course_id) {
        return this.http.post<any>(`${environment.apiUrl}/data/course/generateCourseToken?id=${course_id}`,
            { observe: 'response' });
    }

    updateSession(session_id, objSession) {
        let params = new HttpParams();
        params = params.append('id', session_id);
        return this.http.post<any>(`${environment.apiUrl}/data/session/edit`,
            objSession, { params, observe: 'response' });
    }

    endSession(session_id) {
        return this.http.post<any>(`${environment.apiUrl}/data/session/updateStatus?id=${session_id}&&status=END`,
            { observe: 'response' });
    }

}
