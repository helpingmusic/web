import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DiscountService } from 'app/main/discounts/discount.service';
import { Discount } from 'models/discount';

@Component({
  selector: 'home-edit-discount-modal',
  templateUrl: './edit-discount-modal.component.html',
  styleUrls: ['./edit-discount-modal.component.scss']
})
export class EditDiscountModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EditDiscountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discount: Discount },
    private discountService: DiscountService,
  ) {
    this.form = fb.group({
      title: [data.discount.title, [val.required]],
      body: [data.discount.body, [val.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;

    if (this.data.discount._id) {
      this.discountService.update(this.data.discount._id, form.value);
    } else {
      this.discountService.create(form.value);
    }

    this.ref.close(true);
  }

}
