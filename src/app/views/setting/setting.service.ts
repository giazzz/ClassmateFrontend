import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    getProfile(id: string) {
        let params = new HttpParams();
        params = params.append('id', id);
        return this.http.get<any>(`${environment.apiUrl}/data/user/profile`,
            { params, observe: 'response' });
    }

    updateProfile(objProfile) {
        return this.http.post<any>(`${environment.apiUrl}/data/user/profile/update`,
            objProfile, { observe: 'response' });
    }

    faceCheckDefinition(objImg) {
        return this.http.post<any>(`${environment.apiUrl}/data/user/profile/faceCheckDefinition`,
            objImg, { observe: 'response' });
    }
}
