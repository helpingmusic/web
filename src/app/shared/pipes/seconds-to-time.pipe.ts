import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform {

  transform(duration: number, args?: any): any {
    const secs = Math.trunc(duration % 60),
      min = Math.trunc(duration / 60);
    if (Number.isNaN(secs)) return '';
    return min + ':' + ((secs < 10) ? ('0' + secs) : secs);
  }

}
