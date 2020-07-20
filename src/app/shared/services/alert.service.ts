import { Injectable } from "@angular/core";
import toastr from 'toastr';
@Injectable()

export class AlertService {
  
  successAlert(msg) {
    toastr.remove();
    toastr.success(msg);
  }
  
  errorAlert(msg) {
    toastr.remove();
    toastr.error(msg);
  }

  warningAlert(msg) {
    toastr.remove();
    toastr.warning(msg);
  }

  infoAlert(msg) {
    toastr.remove();
    toastr.info(msg);
  }

}
