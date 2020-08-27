import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginResponseModel} from '../model/response/login-response.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    //#region properties

    private _currentUserSubject$: BehaviorSubject<LoginResponseModel>;

    public currentUserValue$: Observable<LoginResponseModel>;


    public currentUser: Observable<LoginResponseModel>;

    headers = new HttpHeaders();


    //#endregion

    constructor(
        private jwtHelperService: JwtHelperService,
        private http: HttpClient
    ) {
        this._currentUserSubject$ = new BehaviorSubject<LoginResponseModel>(null);
        this.currentUserValue$ = this._currentUserSubject$.asObservable();
        // this.headers = this.headers.set('Content-Type', 'application/json');
    }

    public currentUserValue(): LoginResponseModel {
        return this._currentUserSubject$.getValue();
    }

    // TODO : get url api
    public login(username: string, password: string): Observable<LoginResponseModel> {
        return this.http.post<LoginResponseModel>(`${environment.apiUrl}/auth/signin`, {username, password})
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    user.token = `Bearer ${user.token}`
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this._currentUserSubject$.next(user);
                    return user;
                }));
    }

    public logout(): void {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this._currentUserSubject$.next(null);
    }

}
