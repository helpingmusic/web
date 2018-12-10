import { Pipe, PipeTransform } from '@angular/core';

/**
 *  Transform time in seconds to minutes and seconds
 *
 *  eg
 *  72 => 1:12
 */

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let seconds = Math.floor(+value);
    if (!seconds) return '0:00';

    let sec = seconds % 60;
    let min = (seconds - sec) / 60;

    let s = sec.toString();
    if (sec < 10) s = '0' + s;

    return min + ':' + s;
  }

}
