import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'custom-stack-map',
  standalone: true,
  imports: [],
  templateUrl: './stack-map.component.html',
  styleUrl: './stack-map.component.scss',
})
export class StackMapComponent implements OnInit {
  @Input() protected hostComponent!: any;

  ngOnInit(): void {
    console.log('BANANA!!!');
    console.log(this.hostComponent);
  }
}
