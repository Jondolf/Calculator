/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GlobalVarsService } from './global-vars.service';

describe('Service: GlobalVars', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalVarsService]
    });
  });

  it('should ...', inject([GlobalVarsService], (service: GlobalVarsService) => {
    expect(service).toBeTruthy();
  }));
});
