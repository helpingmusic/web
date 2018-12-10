import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripePrice'
})
export class StripePricePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return '0';
    const v = value / 100;
    if (Math.trunc(v) === v) return v;
    return v.toFixed(2);
  }

}
