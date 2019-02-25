import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatCheckboxModule,
  MatChipsModule, MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatOptionModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatRadioModule, MatSelectModule,
  MatSidenavModule,
  MatSliderModule, MatSlideToggleModule,
  MatSnackBarModule, MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTreeModule,
  MatNativeDateModule,
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
    MatTreeModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: []
})
export class HomeMaterialModule { }
