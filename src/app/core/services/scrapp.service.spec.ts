import { TestBed } from '@angular/core/testing';

import { ScrappService } from './scrapp.service';

describe('ScrappService', () => {
  let service: ScrappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrappService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
