import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';
import { CurrencyConverterService } from './currency-converter.service';

export interface CurrencyUnit extends Unit {
  isoCode: string;
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  amount = '1';
  showOnlyMostTraded = true;
  currentUnitName = 'Euro';
  /*
  Multipliers are strings to avoid losing the precision with large numbers.
  Unit converter changes them into Decimals and calculates them correctly.
  */
  currentUnit: CurrencyUnit = {
    name: 'Euro',
    abbreviation: '€',
    multiplier: '1',
    isoCode: 'EUR'
  };

  constructor(public unitConverter: UnitConverterService, public currencyConverter: CurrencyConverterService) {
  }

  async ngOnInit() {
    /*
    Filter out currency with ISO code EUR because it's the base currency.
    The Foreign exchange rates API doesn't allow the base currency in the GET request
    */
    this.currencyConverter.isoCodes = this.currencyConverter.currencies
      .filter((currency: CurrencyUnit) => currency.isoCode !== 'EUR')
      .map(({ isoCode }) => isoCode);
    if (Object.keys(this.currencyConverter.exchangeRates).length === 0) {
      this.currencyConverter.exchangeRates = await this.currencyConverter.getExchangeRates(this.currencyConverter.isoCodes);
    }

    await this.currencyConverter.setCurrenciesMultipliers();
  }
}
