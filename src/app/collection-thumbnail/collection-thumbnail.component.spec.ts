import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { CollectionThumbnailComponent } from './collection-thumbnail.component';

describe('CollectionThumbnailComponent', () => {
  let component: CollectionThumbnailComponent;
  let fixture: ComponentFixture<CollectionThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionThumbnailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
