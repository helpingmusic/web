import { MatDialog } from '@angular/material';
import { EditDiscountModalComponent } from 'app/main/discounts/edit-discount-modal/edit-discount-modal.component';
import { first, share, tap } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/notification.service';

import { Discount } from 'models/discount';
import { DiscountService } from './discount.service';

@Component({
  selector: 'home-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit, AfterViewInit {

  isAdmin: boolean;
  discount$: Observable<Array<Discount>>;

  constructor(
    private auth: AuthService,
    private discountService: DiscountService,
    private modal: MatDialog,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.isAdmin = this.auth.hasRole('admin');

    this.discount$ = this.discountService.index();

    this.notificationService.notifications$.pipe(first())
      .subscribe(() => this.notificationService.markRead('discount'));
  }

  ngAfterViewInit() {
  }

  createDiscount() {
    const discount = new Discount();
    this.modal.open(EditDiscountModalComponent, {
      width: '400px',
      data: { discount },
    })
  }

}
