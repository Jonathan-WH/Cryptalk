import { TestBed } from '@angular/core/testing';
import { EtherCreateAdressService } from './ether-create-adress.service';

describe('EtherCreateAdressService', () => {
  let service: EtherCreateAdressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtherCreateAdressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
