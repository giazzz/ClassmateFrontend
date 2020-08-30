import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';

import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ModalModule,
    FontAwesomeModule
  ],
    declarations: [DashboardComponent],
    exports: [DashboardComponent]
})
export class DashboardModule {
}
