import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AuthService } from 'app/core/auth/auth.service';
import { DeleteDiscountModalComponent } from 'app/main/discounts/delete-discount-modal.component';
import { EditDiscountModalComponent } from 'app/main/discounts/edit-discount-modal/edit-discount-modal.component';

import { Discount } from 'models/discount';
import { User } from 'models/user';

@Component({
  selector: 'home-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  @Input() instance: Discount;
  @Output() deleteDiscount = new EventEmitter<Discount>();
  @Output() editDiscount = new EventEmitter<Discount>();

  userRole: string;

  constructor(
    private auth: AuthService,
    private modal: MatDialog,
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe((u: User) => {
        this.userRole = u.role;
      });
  }

  edit() {
    this.modal.open(EditDiscountModalComponent, {
      width: '400px',
      data: { discount: this.instance },
    });
  }

  delete() {
    this.modal.open(DeleteDiscountModalComponent, {
      width: '400px',
      data: { discount: this.instance },
    });
  }

}
