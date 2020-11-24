import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  template: ` <div [ngStyle]="getMyStyles()" class="skelt-load loader"></div> `,
  styleUrls: ['./skeleton-loader.component.css'],
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() Cwidth:any;
  @Input() Cheight:any;
  @Input() circle: boolean;
  @Input() Cbackground: any;

  constructor() {}

  ngOnInit() {}

  getMyStyles() {
    const myStyles = {
      'width': this.Cwidth ? this.Cwidth : '',
      'height': this.Cheight ? this.Cheight : '',
      'border-radius': this.circle ? '50%' : '',
      'background': this.Cbackground ? this.Cbackground : '',
    };
    return myStyles;
  }
}
