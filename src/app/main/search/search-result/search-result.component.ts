import { Component, Input, OnInit } from '@angular/core';
import { User } from 'models/user';

@Component({
  selector: 'home-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input() result: User;
  bg: string;

  constructor() {
    this.bg = this.randomBackground();
  }

  ngOnInit() {
  }

  randomBackground() {
    const bg = [
      '#2E447C',
      '#ED6571',
      '#A4036F',
      '#18B2A3',
    ];
    return bg[Math.random() * bg.length | 0];
  }


}
