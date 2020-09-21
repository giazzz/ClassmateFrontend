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

    getListAllExcercise(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/all`,
            { params, observe: 'response' });
    }

    getDetailExcercise(ex_id) {
        let params = new HttpParams();
        params = params.append('id', ex_id);
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/detail`,
            { params, observe: 'response' });
    }

    createExcercise(objEx) {
        return this.http.post<any>(`${environment.apiUrl}/data/exercise/save`,
            objEx, { observe: 'response' });
    }

    updateExcercise(exId, objEx) {
        let params = new HttpParams();
        params = params.append('id', exId);
        return this.http.post<any>(`${environment.apiUrl}/data/exercise/edit`,
            objEx, { params, observe: 'response' });
    }

    updateStatusExcercise(exId, status) {
        return this.http.post<any>(`${environment.apiUrl}/data/exercise/updateStatus?id=${exId}&&status=${status}`,
            { observe: 'response' });
    }

    // Nộp bài tập:
    postExcercise(exercise_id, objEx) {
        let params = new HttpParams();
        params = params.append('exercise_id', exercise_id);
        return this.http.post<any>(`${environment.apiUrl}/data/exercise/studentExercise/save`,
            objEx, { params, observe: 'response' });
    }

}
