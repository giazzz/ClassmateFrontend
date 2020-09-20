import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
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

    getAllStudentWithAttendanceResult(session_id) {
        let params = new HttpParams();
        params = params.append('session_id', session_id);
        return this.http.get<any>(`${environment.apiUrl}/data/attendance/checkResult`,
            { params, observe: 'response' });
    }

    attendanceByStudent(objAttendance) {
        return this.http.post<any>(`${environment.apiUrl}/data/attendance/check`,
        objAttendance, { observe: 'response' });
    }

    // Check all:
    checkAll(session_id, lstAttendance) {
        let params = new HttpParams();
        params = params.append('session_id', session_id);
        return this.http.post<any>(`${environment.apiUrl}/data/attendance/checkAll`,
        lstAttendance, { params, observe: 'response' });
    }

    // Check one:
    checkOne(session_id, objAttend) {
        let params = new HttpParams();
        params = params.append('session_id', session_id);
        return this.http.post<any>(`${environment.apiUrl}/data/attendance/checkOne`,
            objAttend, { params, observe: 'response' });
    }

}
