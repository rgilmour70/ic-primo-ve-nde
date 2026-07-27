import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { CollectionThumbnailComponent } from '../collection-thumbnail/collection-thumbnail.component';

@Component({
  selector: 'custom-collection-gallery',
  standalone: true,
  host: { class: 'grid-item' },
  imports: [CollectionThumbnailComponent],
  templateUrl: './collection-gallery-block.component.html',
  styleUrl: './collection-gallery-block.component.scss',
})
export class CollectionGalleryBlockComponent implements AfterViewInit {
  @Input() hostComponent!: any;
  @Input() collectionName!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private checkQuery(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get('vid') ?? '';
  }

  get collectionUrl(): string {
    const collectionId = this.hostComponent?.collection?.pid?.value;
    const vid = this.checkQuery();
    return `/nde/collectionDiscovery?vid=${vid}&collectionId=${collectionId}&lang=en`;
  }

  get collectionDescription(): string {
    return this.hostComponent?.collection?.description;
  }

  ngOnInit() {
    console.log('!!!! KUMQUAT !!!!');
    console.log(this.hostComponent);
  }

  ngAfterViewInit() {
    const wrapper = this.el.nativeElement.parentElement;
    const originalHost = wrapper?.previousElementSibling;
    if (
      originalHost?.tagName?.toLowerCase() ===
      'nde-collection-discovery-gallery-collection'
    ) {
      this.renderer.setStyle(originalHost, 'display', 'none');
    }
  }
}
