import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  @Input() collapsible: boolean = false;
  @Input() collapsed: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggleCollapse() {
    if (!this.collapsible) return;
    this.collapsed = !this.collapsed;
  }

}
