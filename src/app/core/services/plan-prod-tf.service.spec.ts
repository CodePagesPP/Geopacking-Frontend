import { TestBed } from '@angular/core/testing';

import { PlanProdTfService } from './plan-prod-tf.service';

describe('PlanProdTfService', () => {
  let service: PlanProdTfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanProdTfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
