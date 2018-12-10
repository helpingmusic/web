import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  focused: boolean;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  navigateSearch(query: string) {
    this.router.navigate(['/directory'], {
      'queryParams': { q: query }
    });
  }
}
