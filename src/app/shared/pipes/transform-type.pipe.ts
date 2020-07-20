import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'transformType' })
export class TransFormType implements PipeTransform {
  transform(type?: any): string {
    let typeCustom = '';
    switch (type) {
      case 1:
        typeCustom = 'Scheduled Meeting';
        break;
      case 2:
        typeCustom = 'Chat';
        break;
      case 3:
        typeCustom = 'Phone Call';
        break;
      case 4:
        typeCustom = 'Web Conference';
        break;
      default:
        typeCustom = '';
    }
    return typeCustom;
  }
}

