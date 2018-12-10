import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Invoice } from 'models/invoice';

@Component({
  selector: 'home-invoice-summary',
  template: `

    <div class="invoice-wrapper clearfix">

      <div class="row-content" (click)="collapsed = !collapsed">
        <div class="pull-left mt-sm mb-sm">
          <h4 class="list-group-item-heading">
            {{description}}
            <small class="text-uppercase xs"
              [ngClass]="{
                'text-success': status === 'succeeded',
                'text-danger': status === 'failed',
                'text-warning': status === 'refunded',
                'text-muted': status === 'pending'
              }">
              {{ status }}
            </small>
          </h4>

          <p class="list-group-item-text subtext">{{capturedOn}}</p>
        </div>

        <h3 class="pull-right mt-sm pr-lg">$ {{invoice.amount_due | stripePrice}}</h3>

        <span class="collapse-ctrl material-icons">
          {{ collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}}
        </span>

      </div>

      <div class="summary clear" [hidden]="collapsed">
        <table class="table m-n">
          <tr [hidden]="!invoice?.charge?.id">
            <th>Card</th>
            <td>
              {{invoice?.charge?.source?.brand}} {{invoice?.charge?.source?.last4}}
            </td>
          </tr>
          <tr>
            <th>Items</th>
            <td class="p-n">
              <ul class="items m-n">
                <li *ngFor="let item of items" class="clear row m-n pt-sm pb-sm">
                  <p class="col-sm-10 col-xs-9 m-n">{{item.description | pretty}}</p>
                  <strong class="col-sm-2 col-xs-3">$ {{item.amount | stripePrice}}</strong>
                </li>
              </ul>
            </td>
          </tr>

          <tr>
              <th>Subtotal</th>
              <td>
                <strong class="pull-right col-sm-2 col-xs-3">$ {{invoice.amount_due | stripePrice}}</strong>
              </td>
          </tr>

          <tr [hidden]="!invoice.discount">
              <th>Discount</th>
              <td>
                <p class="col-sm-10 col-xs-9 mn">
                  {{discountDescription}}
                </p>
                <strong class="pull-right col-sm-2 col-xs-3">$ {{discountAmount | stripePrice}}</strong>
              </td>
          </tr>

          <tr [hidden]="!invoice?.charge?.amount_refunded">
              <th>Refunded Amount</th>
              <td>
                <strong class="pull-right col-sm-2 col-xs-3">$ {{invoice?.charge?.amount_refunded | stripePrice}}</strong>
              </td>
          </tr>

          <tr>
              <th>Total Paid</th>
              <td>
                <strong class="pull-right col-sm-2 col-xs-3">$ {{(invoice?.amount_due - invoice?.charge?.amount_refunded) | stripePrice}}</strong>
              </td>
          </tr>

        </table>
      </div>
    </div>

  `,
  styles: [`
    .invoice-wrapper {
      border-bottom: 1px solid #ddd;
      position: relative;
    }
    .list-group-item {
      border-bottom: 1px solid #ddd;
      padding: 0;
    }
    .row-content {
      cursor: pointer;
      padding: 0 15px !important;
      width: 100% !important;
    }
    span.collapse-ctrl {
      position: absolute;
      right: 10px;
      top: 17px;
      color: #424242;
    }
    .summary {
      background: #f6f7f9;
    }
    h3 {
      font-weight: 100;
      color: #bfbfbf;
      margin: 15px 0 !important;
    }
    ul.items {
      list-style: none;
      padding: 0;
    }
    ul.items li:not(:last-child) {
      border-bottom: 1px solid #ddd;
    }
    strong {
      padding: 0;
      white-space: nowrap;
    }
  `],
})
export class InvoiceSummaryComponent implements OnInit {

  @Input('invoice') invoice: Invoice;
  collapsed = true;

  capturedOn: string;
  items: Array<any>;
  description: string;
  status: string;
  discountDescription: string;
  discountAmount: number;

  constructor() {
  }

  ngOnInit() {
    /**
     * Formatting display information
     */
    this.capturedOn = moment(this.invoice.date * 1000).format('MMM Do, YYYY');

    this.items = this.invoice.lines.data.map(lineItem => {
      let description = lineItem.description;
      if (!description && lineItem.plan) {
        description = lineItem.plan.statement_descriptor;
      }

      let duration;
      if (lineItem.period && lineItem.period.start !== lineItem.period.end) {
        const st = moment(lineItem.period.start).format('MMM Do, YYYY');
        const end = moment(lineItem.period.end).format('MMM Do, YYYY');
        duration = st + ' - ' + end;
      }

      return {
        description,
        duration,
        amount: lineItem.amount,
      };
    });

    if (this.invoice.charge && this.invoice.charge.refunded) {
      const refunds = this.invoice.charge.refunds.data.map(r => ({
        description: 'Refund',
        amount: -r.amount,
      }));
      this.items = this.items.concat(refunds);
    }

    this.description = this.invoice.description
      || this.invoice.statement_descriptor
      || (this.items.length === 1 ? this.items[0].description : 'H.O.M.E. Invoice');


    if (this.invoice.charge) {
      this.status = this.invoice.charge.status;
      if (this.invoice.charge.refunded) {
        this.status = 'refunded';
      }
    } else {
      if (this.invoice.paid) {
        this.status = 'succeeded'
      } else {
        this.status = 'pending';
      }
    }

    if (this.invoice.discount) {
      const d = this.invoice.discount;
      let offAmount;
      if (d.coupon.amount_off) {
        offAmount = '$' + (d.coupon.amount_off / 100);
      } else { //percent off
        offAmount = d.coupon.percent_off + '%';
      }
      let every = 'once';
      if (d.coupon.duration === 'repeating') {
        every = 'every month';
      }
      let until = 'until ' + moment(d.end * 1000).format('MMM Do, YYYY');
      this.discountDescription = `Coupon code ${d.coupon.id} is valid for ${offAmount} off ${every} ${until}.`

      if (d.amount_off) {
        this.discountAmount = d.amount_off;
      } else { //percent
        this.discountAmount = this.invoice.amount_due * d.percent_off / 100;
      }
    }
  }

}
