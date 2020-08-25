import {User} from '../../model/user.model';
import {Observable} from 'rxjs';

export interface IAuthenticationService {
    currentUserValueAsync(): User;

    login(username: string, password: string): Observable<User>;

    logout(): void;
}
