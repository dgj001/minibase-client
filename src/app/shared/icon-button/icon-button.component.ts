import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {
  @Input() icon: string;

  iconPath: string;

  constructor() { }

  ngOnInit(): void {
    this.iconPath = `assets/svg/icons.svg#${this.icon}`;
  }

}
