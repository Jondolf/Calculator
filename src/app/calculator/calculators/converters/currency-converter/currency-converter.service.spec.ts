/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { CurrencyConverterService } from './currency-converter.service';

describe('Service: CurrencyConverter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyConverterService]
    });
  });

  it('should ...', inject([CurrencyConverterService], (service: CurrencyConverterService) => {
    expect(service).toBeTruthy();
  }));
});
