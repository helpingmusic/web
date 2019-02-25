import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

interface PromptModalOptions {
  title: string;
  body: string[];
  cancelButton: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonColor?: string;
}

@Component({
  selector: 'home-prompt-modal',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <p *ngFor="let text of data.body">{{ text }}</p>
    </div>
    <div mat-dialog-actions>
      <button 
        *ngIf="data.cancelButton !== false" 
        mat-button 
        [mat-dialog-close]="false">
        {{ data.cancelButtonText || 'Nevermind' }}
      </button>
      <button
        mat-flat-button
        [color]="data.confirmButtonColor || 'primary'"
        [mat-dialog-close]="true">
        {{ data.confirmButtonText || 'Okay' }}
      </button>
    </div>
  `,
  styles: []
})
export class PromptModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PromptModalOptions
  ) { }

}
