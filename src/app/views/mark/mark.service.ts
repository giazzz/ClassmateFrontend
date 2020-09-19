import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MarkService {
    headers;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
    }

    getListStudentOfCourse(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/course/allProfileInCourse`,
            { params, observe: 'response' });
    }

    // For teacher:
    getListAllExcercise(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/gradeList`,
            { params, observe: 'response' });
    }

    // For student by course;
    getListStudentExcercise(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/gradeListStudent`,
            { params, observe: 'response' });
    }

    // All by student;
    getStudentAllExcercise() {
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/gradeListStudent`,
            { observe: 'response' });
    }

    markStudentExercise(exercise_id, objMark) {
        let params = new HttpParams();
        params = params.append('id', exercise_id);
        return this.http.post<any>(`${environment.apiUrl}/data/exercise/studentExercise/mark`,
        objMark, { params, observe: 'response' });
    }
}
