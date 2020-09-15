import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CheckRole {
    isStudent(): boolean {
        return JSON.parse(localStorage.currentUser).roles.includes('ROLE_STUDENT');
    }

    isTeacher(): boolean {
        return JSON.parse(localStorage.currentUser).roles.includes('ROLE_TEACHER');
    }

    isAdmin(): boolean {
        return JSON.parse(localStorage.currentUser).roles.includes('ROLE_ADMIN');
    }
}
