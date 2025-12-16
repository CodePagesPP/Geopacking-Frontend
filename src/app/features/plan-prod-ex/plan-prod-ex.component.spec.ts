import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanProdEXComponent } from './plan-prod-ex.component';

describe('PlanProdEXComponent', () => {
  let component: PlanProdEXComponent;
  let fixture: ComponentFixture<PlanProdEXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanProdEXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanProdEXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
