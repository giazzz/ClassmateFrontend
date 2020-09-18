import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })

export class Toastr {
    constructor(private toastr: ToastrService) {
    }

    showToastrSuccess(title: string, content: string) {
        this.toastr.success(content, title, {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton : false
        });
    }

    showToastrWarning(title: string, content: string) {
        this.toastr.warning(content, title, {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            easing: 'ease-in',
            closeButton : false
        });
    }
}
