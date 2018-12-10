import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charLimit'
})
export class CharLimitPipe implements PipeTransform {

  transform(value: any, limit = 140): any {
    if (value.length <= 140)
      return null;
  }

}
