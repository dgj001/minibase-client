import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-round-icon-button',
  templateUrl: './round-icon-button.component.html',
  styleUrls: ['./round-icon-button.component.scss']
})
export class RoundIconButtonComponent implements OnInit {
  @Input() icon: string;

  iconPath: string;

  constructor() { }

  ngOnInit() {
    this.iconPath = `assets/svg/icons.svg#${this.icon}`;
  }

}
