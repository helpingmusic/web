import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DiscountService } from 'app/main/discounts/discount.service';
import { Discount } from 'models/discount';

@Component({
  selector: 'home-delete-discount-modal',
  template: `
    <h2 mat-dialog-title>Delete Discount</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to remove the discount
        <b>{{ data.discount.title }}</b>?
      </p>
      <p>
        This action cannot be undone.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      
      <button (click)="remove()" class="btn-danger" mat-button type="submit">Remove</button>
    </mat-dialog-actions>

  `,
  styles: []
})
export class DeleteDiscountModalComponent implements OnInit {

  constructor(
    private ref: MatDialogRef<DeleteDiscountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discount: Discount },
    private discountService: DiscountService,
  ) {
  }

  ngOnInit() {
  }

  remove() {
    this.discountService.delete(this.data.discount._id);
    this.ref.close(true);
  }

}
