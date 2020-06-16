/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
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
