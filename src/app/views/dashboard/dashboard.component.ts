import {Component, OnDestroy, OnInit} from '@angular/core';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Subscription} from 'rxjs';

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    public imageUrl;
    public faPlus;
    public currentUser;
    public subscription;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.subscription = new Subscription();
        const user = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.subscription.add(user);
    }


    ngOnInit(): void {
        this.faPlus = faPlus;
        this.imageUrl = 'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png';
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['login']);
    }

    ngOnDestroy() {
        this.subscription.close();
    }
}
