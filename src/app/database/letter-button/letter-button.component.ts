import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-letter-button',
  templateUrl: './letter-button.component.html',
  styleUrls: ['./letter-button.component.scss']
})
export class LetterButtonComponent implements OnInit {
  @Input() letter: string;
  @Input() paddingTop: number;

  constructor() { }

  ngOnInit() {
  }

  getMarginTop() {
    return this.letter === '+' ? '0' : '-1';
  }
}
