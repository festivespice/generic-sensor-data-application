import { TestBed } from '@angular/core/testing';

import { SensorConfigService } from './sensor-config.service';

describe('SensorConfigService', () => {
  let service: SensorConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
