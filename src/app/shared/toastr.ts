import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })

export class Toastr {
    constructor(private toastr: ToastrService) {
    }

    showToastrSuccess(content: string, title: string, timeOut = 3000) {
        this.toastr.success(content, title, {
            timeOut: timeOut,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton : false
        });
    }

    showToastrWarning(content: string, title: string, timeOut = 3000) {
        this.toastr.warning(content, title, {
            timeOut: timeOut,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton : false
        });
    }
}
