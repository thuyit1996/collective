import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customName' })
export class CustomNamePipe implements PipeTransform {
  transform(fieldName?: any, email?: string): string {
    return !fieldName ? (email.charAt(0) + email.charAt(1))?.toUpperCase() : fieldName;
  }
}