import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'prettyDate'
})
export class PrettyDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(value).format('MMM Do, YYYY');
  }

}
