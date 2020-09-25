import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PeopleService {
    headers;

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
    }

    allProfileInCourse(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/course/allProfileInCourse`,
            { params, observe: 'response' });
    }

    addToCourse(objId) {
        return this.http.post<any>(`${environment.apiUrl}/data/course/addToCourse`,
            objId, { observe: 'response' });
    }

    removeFromCourse(objId) {
        return this.http.post<any>(`${environment.apiUrl}/data/course/removeFromCourse`,
            objId, { observe: 'response' });
    }

}
