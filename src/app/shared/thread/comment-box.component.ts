import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'home-comment-box',
  template: `
    
    <mat-form-field>
      <textarea matInput
                matTextareaAutosize
                rows="1"
                #input
                (blur)="onBlur()"
                [(ngModel)]="text"
                placeholder="Respond...">
      </textarea>
      <button mat-flat-button matSuffix color="accent"
              class="btn-sm"
              (click)="comment(text)">POST</button>
    </mat-form-field>
    
  `,
  styles: [`

    mat-form-field {
      margin: 0;
    }
    button {
      margin-bottom: 6px;
    }
  `]
})
export class CommentBoxComponent implements OnInit, AfterViewInit {

  @Output('submit') submit = new EventEmitter<string>();
  @Output('cancel') cancel = new EventEmitter<string>();
  @Input('text') text: string;
  @Input('focus') focus: boolean = true;
  @ViewChild('input') input: ElementRef;

  constructor() {
  }

  ngOnInit() {
    this.input.nativeElement
      .addEventListener('input', () => this.resizeInput(), false);
  }

  onBlur() {
    if (!this.text) this.cancel.emit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeInput();
      if (this.focus) this.input.nativeElement.focus();
    }, 10);
  }

  resizeInput() {
    this.input.nativeElement.style.height = 'auto';
    this.input.nativeElement.style.height = (this.input.nativeElement.scrollHeight) + 'px';
  }

  comment(text) {
    if (!text) return;

    this.submit.emit(text);
    this.text = '';
    this.resizeInput();
  }

}
