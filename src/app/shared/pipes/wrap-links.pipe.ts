import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wrapLinks'
})
export class WrapLinksPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return '';
    const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return value.replace(urlRegex, function (url) {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });

  }

}
