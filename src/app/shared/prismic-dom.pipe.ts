import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RichText } from 'prismic-dom';

@Pipe({
  name: 'prismic',
})
export class PrismicDomPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(`
      <div class="prismic-render">
        ${RichText.asHtml(value)}
      </div>
    `);
  }

}
