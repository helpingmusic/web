import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'home-accept-booking-terms-modal',
  templateUrl: './accept-booking-terms-modal.component.html',
})
export class AcceptBookingTermsModalComponent implements OnInit {

  acceptsTerms: boolean;

  constructor(
    private ref: MatDialogRef<AcceptBookingTermsModalComponent>,
  ) { }

  ngOnInit() {
  }

  onToggleChange(event: MatSlideToggleChange) {
    this.acceptsTerms = event.checked;
  }

  onSubmit() {
    this.ref.close(this.acceptsTerms);
  }

}
