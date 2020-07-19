import { TestBed } from '@angular/core/testing';

import { DormService } from './dorm.service';

describe('DormService', () => {
  let service: DormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
