export interface IAuthorizationService {
    isAuthorized(allowedRoles: string[]): boolean;
}
