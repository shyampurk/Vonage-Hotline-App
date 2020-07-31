import { TestBed } from '@angular/core/testing';

import { NexmoClientService } from './nexmo-client.service';

describe('NexmoClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NexmoClientService = TestBed.get(NexmoClientService);
    expect(service).toBeTruthy();
  });
});
