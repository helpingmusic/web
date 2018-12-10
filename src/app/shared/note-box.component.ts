import { Component, Input } from '@angular/core';

@Component({
  selector: 'home-note-box',
  template: `
    <div [class]="'box box-'+ type">
      <div class="icon" [ngSwitch]="type">
        <i *ngSwitchCase="'info'" class="material-icons">info</i>
      </div>

      <div class="box-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class NoteBoxComponent {
  @Input() type: string;
}
