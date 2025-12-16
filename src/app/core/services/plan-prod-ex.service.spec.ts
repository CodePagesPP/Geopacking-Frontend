import { TestBed } from '@angular/core/testing';

import { PlanProdExService } from './plan-prod-ex.service';

describe('PlanProdExService', () => {
  let service: PlanProdExService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanProdExService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
