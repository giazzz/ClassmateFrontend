import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassRoomService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    getAllCourse() {
        return this.http.get<any>(`${environment.apiUrl}/data/course/all`,
            { observe: 'response' });
    }
}