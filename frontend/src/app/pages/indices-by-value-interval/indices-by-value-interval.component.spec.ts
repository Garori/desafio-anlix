import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesByValueIntervalComponent } from './indices-by-value-interval.component';

describe('IndicesByValueIntervalComponent', () => {
  let component: IndicesByValueIntervalComponent;
  let fixture: ComponentFixture<IndicesByValueIntervalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicesByValueIntervalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicesByValueIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
