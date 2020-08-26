import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user.model';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {IAuthenticationService} from './interface/authentication-service.interface';

@Injectable()
export class AuthenticationService implements IAuthenticationService{

    //#region properties

    private _currentUserSubject$: BehaviorSubject<User>;

    public currentUserValue$: Observable<User>;


    public currentUser: Observable<User>;

    //#endregion

    constructor(
        private jwtHelperService: JwtHelperService,
        private http: HttpClient
    ) {
        this._currentUserSubject$ = new BehaviorSubject<User>(null);
        this.currentUserValue$ = this._currentUserSubject$.asObservable();
    }

    public currentUserValueAsync(): User {
        return this._currentUserSubject$.getValue();
    }

    // TODO : get url api
    public login(username: string, password: string): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}/auth/signin`, {username, password})
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
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
