export class InvoiceItem {
  id: string;
  object: string;
  amount: number;
  description: string;
  discountable: boolean;
  metadata: any;
  period: {
    start: number;
    end: number;
  };
  plan: {
    id: string;
    amount: number;
    created: number;
    interval: string;
    interval_count: number;
    metadata: any;
    name: string;
    statement_descriptor: string;
    trial_period_days: number;
  };
  proration: boolean;
  quantity: number;
}

export class Charge {
  id: string;
  amount: number;
  amount_refunded: number;
  captured: boolean;
  created: number;
  customer: string;
  description: string;
  metadata: any;
  paid: boolean;
  refunded: boolean;
  refunds: { data: Array<Refund> };
  source: {
    id: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  status: string;
}

export class Refund {
  id: string;
  amount: number;
  created: number
  metadata: any;
  reason: string;
  status: string;
}

export class Invoice {
  id: string;
  charge?: Charge;
  customer: string;
  date: number;

  amount_due: number;
  description: string;
  statement_descriptor: string;

  lines: { data: Array<InvoiceItem>, };
  discount: any;

  attempt_count: number;
  attempted: boolean;

  closed: boolean;
  paid: boolean;
  forgiven: boolean;

  metadata: any;

  subtotal: number;
  tax: number;
  tax_percent: number;
  total: number;
}