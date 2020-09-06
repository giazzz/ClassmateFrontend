import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    headers;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
    }

    getAllCourse() {
        return this.http.get<any>(`${environment.apiUrl}/data/course/all`,
            { headers: this.headers, observe: 'response' });
    }

    addCourse(pObjCourse) {
        return this.http.post(`${environment.apiUrl}/data/course/add`,
        pObjCourse, { headers: this.headers, observe: 'response', responseType: 'text' as 'json' });
    }

    getAllCourseCategory() {
        return this.http.get<any>(`${environment.apiUrl}/data/courseCategory/all`,
            { headers: this.headers, observe: 'response' });
    }
}
