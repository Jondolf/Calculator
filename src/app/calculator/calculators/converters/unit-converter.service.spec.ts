/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { UnitConverterService } from './unit-converter.service';

describe('Service: UnitConverter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitConverterService]
    });
  });

  it('should ...', inject([UnitConverterService], (service: UnitConverterService) => {
    expect(service).toBeTruthy();
  }));
});
