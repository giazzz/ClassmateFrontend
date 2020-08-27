import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

// Import Containers
import {DefaultLayoutComponent} from './containers';

import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {ClassRoomComponent} from './views/class-room/class-room.component';
import {AuthenticationGuard} from './guard/authentication.guard';
import {AttendanceByStudentComponent} from './views/attendance/attendance-by-student/attendance-by-student.component';
import {AttendanceByTeacherComponent} from './views/attendance/attendance-by-teacher/attendance-by-teacher.component';
import {ERoles} from './helper/roles.constants';
import {AuthorizationGuard} from './guard/authorization.guard';
import { AuthenticationService } from './service/authentication.service';
import { AuthorizationService } from './service/authorization.service';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '404',
        component: P404Component,
        data: {
            title: 'Page 404'
        }
    },
    {
        path: '500',
        component: P500Component,
        data: {
            title: 'Page 500'
        }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login Page'
        }
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: {
            title: 'Tạo tài khoản'
        }
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        canActivate: [AuthenticationGuard],
        // canActivateChild: [AuthorizationGuard],
        data: {
            title: 'Home'
        },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: {
                    allowedRoles: [ERoles.ALL]
                }
            },
            {path: 'class/:id/stream', component: ClassRoomComponent},
            {path: 'student/:id/attendance', component: AttendanceByStudentComponent},
            {path: 'class/:id/attendance', component: AttendanceByTeacherComponent}
        ]
    },
    {path: '**', component: P404Component}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        AuthenticationService,
        AuthorizationService,
        AuthenticationGuard, 
        AuthorizationGuard],
})
export class AppRoutingModule {
}
