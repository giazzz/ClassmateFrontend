import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user.model';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    //#region properties

    private currentUserSubject: BehaviorSubject<User>;

    public currentUser: Observable<User>;

    //#endregion

    constructor(
        private jwtHelperService: JwtHelperService,
        private http: HttpClient
    ) {}

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    // TODO : get url api
    public login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}`, {username, password})
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }));
    }

    public logout(): void {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

}
