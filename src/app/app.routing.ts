import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ClassRoomComponent } from './views/class-room/class-room.component';
import { AttendanceByStudentComponent } from './views/attendance/attendance-by-student/attendance-by-student.component';
import { AttendanceByTeacherComponent } from './views/attendance/attendance-by-teacher/attendance-by-teacher.component';
import { PeopleComponent } from './views/people/people.component';
import { ClassworkComponent } from './views/classwork/classwork.component';
import { MarkComponent } from './views/mark/mark.component';
import { SettingComponent } from './views/setting/setting.component';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { TodoComponent } from './views/todo/todo.component';

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
    data: {
      title: 'Home'
    },
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'class/:id/stream', component: ClassRoomComponent, canActivate: [AuthGuard] },
      { path: 'student/:id/attendance', component: AttendanceByStudentComponent, canActivate: [AuthGuard] },
      { path: 'class/:id/attendance', component: AttendanceByTeacherComponent, canActivate: [AuthGuard] },
      { path: 'class/:id/people', component: PeopleComponent, canActivate: [AuthGuard] },
      { path: 'class/:id/classwork', component: ClassworkComponent, canActivate: [AuthGuard] },
      { path: 'class/:id/mark', component: MarkComponent, canActivate: [AuthGuard] },
      { path: 'student/:id/todo', component: TodoComponent, canActivate: [AuthGuard] },
      { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
      { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
