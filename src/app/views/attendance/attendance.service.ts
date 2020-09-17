import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassRoomService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    getAllProfileInCourse(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/course/allProfileInCourse`,
            { params, observe: 'response' });
    }

    attendanceStudent(objAttendance) {
        return this.http.post<any>(`${environment.apiUrl}/data/attendance/check`,
        objAttendance, { observe: 'response' });
    }

    attendanceTeachear(lstAttendance, session_id) {
        let params = new HttpParams();
        params = params.append('session_id', session_id);
        return this.http.post<any>(`${environment.apiUrl}/data/attendance/checkAll`,
        lstAttendance, { params, observe: 'response' });
    }
}
