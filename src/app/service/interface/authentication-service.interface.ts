import {Observable} from 'rxjs';
import {LoginResponseModel} from '../../model/response/login-response.model';

export interface IAuthenticationService {
    currentUserValue(): LoginResponseModel;

    login(username: string, password: string): Observable<LoginResponseModel>;

    logout(): void;
}
