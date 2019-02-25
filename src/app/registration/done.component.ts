import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WalkthroughStep } from 'app/registration/walkthrough-step';

@Component({
  selector: 'home-done',
  template: `
    <mat-card>
      <mat-card-header>
        <h2 mat-card-title>Success!</h2>
        <h2 mat-card-subtitle>You're Done</h2>
      </mat-card-header>

      <div class="text-center">
        <success-icon class="xl"></success-icon>
      </div>

      <mat-card-content>
        <p>You're now an official Homie!</p>
        <p>Please be sure that you do the following:</p>
        <mat-list>
          <mat-list-item>Confirm your email.</mat-list-item>
          <mat-list-item>Check out the event calendar.</mat-list-item>
          <mat-list-item>Make some connections.</mat-list-item>
          <mat-list-item>Be professional.</mat-list-item>
        </mat-list>
        <p>Welcome H.O.M.E.!</p>
      </mat-card-content>

      <mat-card-actions align="end">
        <a (click)="complete" routerLink="/member/me" class="btn btn-action btn-block">
          Go To Profile
        </a>
      </mat-card-actions>

    </mat-card>
  `,
  styles: [`
    p {
      font-size: 16px;
      font-weight: 700;
    }
  `]
})
export class DoneComponent implements WalkthroughStep<any> {
  @Output() completed = new EventEmitter();

  complete() {
    this.completed.emit();
  }
}
