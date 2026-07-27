import { Component, Input, OnInit, inject } from '@angular/core';
// import { Store } from '@ngrx/store';

@Component({
  selector: 'custom-collection-thumbnail',
  standalone: true,
  imports: [],
  templateUrl: './collection-thumbnail.component.html',
  styleUrl: './collection-thumbnail.component.scss',
})
export class CollectionThumbnailComponent {
  @Input() collectionName!: string;
  // private store = inject(Store);
  // ngOnInit() {
  //   console.log('!!!!! BANANA !!!!!!');
  // }
}
