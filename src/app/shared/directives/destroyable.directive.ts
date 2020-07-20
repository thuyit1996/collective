import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appDestroyable]'
})
export class DestroyableDirective implements OnDestroy {
  destroy$ = new Subject();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
