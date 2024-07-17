import { TestBed } from '@angular/core/testing';

import { PinserviceService } from './pinservice.service';

describe('PinserviceService', () => {
  let service: PinserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
