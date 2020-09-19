import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebcamModule } from 'ngx-webcam';
import { AutosizeModule } from 'ngx-autosize';
import { ToastrModule } from 'ngx-toastr';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { ClassRoomComponent } from './views/class-room/class-room.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AttendanceByTeacherComponent } from './views/attendance/attendance-by-teacher/attendance-by-teacher.component';
import { AttendanceByStudentComponent } from './views/attendance/attendance-by-student/attendance-by-student.component';
import { PeopleComponent } from './views/people/people.component';
import { ClassworkComponent } from './views/classwork/classwork.component';
import { MarkComponent } from './views/mark/mark.component';
import { SettingComponent } from './views/setting/setting.component';
import { ScheduleComponent } from './views/schedule/schedule.component';
import { TodoComponent } from './views/todo/todo.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PopoverModule } from 'ngx-smart-popover';

@NgModule({
  imports: [
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    FontAwesomeModule,
    WebcamModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AutosizeModule,
    NgxDocViewerModule,
    ToastrModule.forRoot(),
    PopoverModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    DashboardComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ClassRoomComponent,
    AttendanceByTeacherComponent,
    AttendanceByStudentComponent,
    PeopleComponent,
    ClassworkComponent,
    MarkComponent,
    SettingComponent,
    ScheduleComponent,
    TodoComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
