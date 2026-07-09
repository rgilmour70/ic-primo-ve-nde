import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackMapComponent } from './stack-map.component';

describe('StackMapComponent', () => {
  let component: StackMapComponent;
  let fixture: ComponentFixture<StackMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
