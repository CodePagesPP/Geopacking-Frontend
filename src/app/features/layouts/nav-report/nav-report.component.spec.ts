import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavReportComponent } from './nav-report.component';

describe('NavReportComponent', () => {
  let component: NavReportComponent;
  let fixture: ComponentFixture<NavReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
