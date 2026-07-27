import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionGalleryBlockComponent } from './collection-gallery-block.component';

describe('CollectionGalleryBlockComponent', () => {
  let component: CollectionGalleryBlockComponent;
  let fixture: ComponentFixture<CollectionGalleryBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionGalleryBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionGalleryBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
