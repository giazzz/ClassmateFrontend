import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    // Get list course on active:
    getStudentCourse() {
        let params = new HttpParams();
        params = params.append('statuss[]', 'ONGOING');
        params = params.append('statuss[]', 'PENDING');
        return this.http.get<any>(`${environment.apiUrl}/data/course/followingCourse`,
            { params, observe: 'response' });
    }

    // Get list course on active:
    getTeacherCourse() {
        let params = new HttpParams();
        params = params.append('statuss[]', 'ONGOING');
        params = params.append('statuss[]', 'PENDING');
        return this.http.get<any>(`${environment.apiUrl}/data/course/yourCourse`,
            { params, observe: 'response' });
    }

    addCourse(pObjCourse) {
        return this.http.post<any>(`${environment.apiUrl}/data/course/add`,
            pObjCourse, { observe: 'response'});
    }

    joinByCode(pObjCode) {
        return this.http.post<any>(`${environment.apiUrl}/data/course/joinByToken`,
            pObjCode, { observe: 'response'}).pipe(catchError(this.handleError));
    }

    getAllCourseCategory() {
        return this.http.get<any>(`${environment.apiUrl}/data/courseCategory/all`,
            { headers: this.headers, observe: 'response' });
    }

    handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
