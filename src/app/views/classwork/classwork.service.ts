import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassworkService {
    headers;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
    }

    // getAllCourse() {
    //     return this.http.get<any>(`${environment.apiUrl}/data/course/all`,
    //         { headers: this.headers, observe: 'response' });
    // }

    getListAllExcercise(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/gradeList`,
            { params, observe: 'response' });
    }

}
