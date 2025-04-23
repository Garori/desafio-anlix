import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportToCSVComponent } from './export-to-csv.component';

describe('ExportToCSVComponent', () => {
  let component: ExportToCSVComponent;
  let fixture: ComponentFixture<ExportToCSVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportToCSVComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportToCSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
