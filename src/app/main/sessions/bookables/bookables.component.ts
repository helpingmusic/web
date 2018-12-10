import { Component, OnInit } from '@angular/core';
import { BookableService } from 'app/main/sessions/bookable.service';
import { Observable } from 'rxjs';
import { Bookable } from 'models/bookable';

@Component({
  selector: 'home-bookables',
  templateUrl: './bookables.component.html',
  styleUrls: ['./bookables.component.scss']
})
export class BookablesComponent implements OnInit {

  public bookables$: Observable<Bookable[]>;

  constructor(
    private bookableService: BookableService
  ) {
  }

  ngOnInit() {
    this.bookables$ = this.bookableService.list();
  }

}
