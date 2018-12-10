import { Pipe, PipeTransform } from '@angular/core';

/**
 * Take an href link and format it to be an external link
 *
 * eg
 * google.com would be //google.com
 * And https://google.com would be unchanged
 */

@Pipe({
  name: 'linkFormat'
})
export class LinkFormatPipe implements PipeTransform {

  transform(href: string): any {
    if (!href) return '';
    return 'http://' + href.replace(/https?:\/\//, '');
  }

}
