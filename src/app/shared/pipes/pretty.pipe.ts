import { Pipe, PipeTransform } from '@angular/core';

/**
 *  Pretty
 *
 *  Generic cleaning Pipe
 *  Will remove underscores and capitalize first letter of each word
 */

@Pipe({
  name: 'pretty'
})
export class PrettyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return '';
    return value.replace('_', ' ')
      .replace(/\w\S*/g, (s) => s.charAt(0).toUpperCase() + s.substr(1));
  }

}
