import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanProdTfComponent } from './plan-prod-tf.component';

describe('PlanProdTfComponent', () => {
  let component: PlanProdTfComponent;
  let fixture: ComponentFixture<PlanProdTfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanProdTfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanProdTfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
