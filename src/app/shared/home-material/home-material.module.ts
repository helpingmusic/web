import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';

import {
  MatBadgeModule,
  MatButtonModule, MatCardModule,
  MatChipsModule,
  MatDialogModule, MatDividerModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatMenuModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatSidenavModule, MatSliderModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule
} from '@angular/material';


/**
 * Just for angular material imports
 */
@NgModule({
  exports: [
    ScrollDispatchModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatBadgeModule,
    MatDividerModule,
    MatProgressBarModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatSliderModule,
    MatExpansionModule,
    MatSidenavModule,
  ],
  declarations: []
})
export class HomeMaterialModule { }
