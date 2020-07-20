import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'transformIcon' })
export class TransFormIcon implements PipeTransform {
  transform(type?: any): string {
    let customType = '';
    switch (type) {
      case 2:
        customType = 'video';
        break;
      case 3:
        customType = 'phone-call';
        break;
      case 4:
        customType = 'users';
        break;
      default:
        customType = '';
    }
    return customType;
  }
}

