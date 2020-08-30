import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    headers = new HttpHeaders();
    token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBZG1pbjg4OCIsImlhdCI6MTU5ODQ1MjA5OCwiZXhwIjoxNTk4NTM4NDk4fQ.ovt5FOURo5w42cYg1xCrf7HDfI9QzYYeSleCT-wz291imhzJ4diT-xVsOI_xoWr2JhPR0Ee_TJ0g1bdW5qlCgQ';

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Authorization', this.token);
    }

    getAllCourse() {
        return this.http.get<any>(`${environment.apiUrl}/data/course/all`,
            { observe: 'response' });
    }

    addCourse(pObjCourse) {
        return this.http.post(`${environment.apiUrl}/data/course/add`,
        pObjCourse, { headers: this.headers, observe: 'response', responseType: 'text' as 'json' });
    }
}
