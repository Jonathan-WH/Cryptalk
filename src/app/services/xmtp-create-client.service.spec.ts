import { TestBed } from '@angular/core/testing';

import { XmtpCreateClientService } from './xmtp-create-client.service';

describe('XmtpCreateClientService', () => {
  let service: XmtpCreateClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmtpCreateClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
