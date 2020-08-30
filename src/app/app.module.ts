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

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

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
import {AttendanceByTeacherComponent} from './views/attendance/attendance-by-teacher/attendance-by-teacher.component';
import {AttendanceByStudentComponent} from './views/attendance/attendance-by-student/attendance-by-student.component';
import {ErrorInterceptor} from './service/errorIntercepter.interceptor';
import {AUTHENTICATION_SERVICE_PROVIDER, AUTHORIZATION_SERVICE_PROVIDER} from './service/service.constant';
import {JwtInterceptor, JwtModule} from '@auth0/angular-jwt';
import {AuthorizationService} from './service/authorization.service';
import {AuthenticationService} from './service/authentication.service';
import {DashboardModule} from './views/dashboard/dashboard.module';

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
    JwtModule.forRoot({}),
    AppRoutingModule,
    ChartsModule,
      DashboardModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ClassRoomComponent,
    AttendanceByTeacherComponent,
    AttendanceByStudentComponent
  ],
  providers: [
      // {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: AUTHENTICATION_SERVICE_PROVIDER, useClass: AuthenticationService},
    { provide: AUTHORIZATION_SERVICE_PROVIDER, useClass: AuthorizationService}
    ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
