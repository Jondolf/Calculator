import { Component, OnInit } from '@angular/core';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';
import { CurrencyConverterService } from './currency-converter.service';

export interface CurrencyUnit extends Unit {
  isoCode?: string;
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.page.html',
  styleUrls: ['./currency-converter.page.scss'],
})
export class CurrencyConverterPage implements OnInit {
  amount = '1';
  showOnlyMostTraded = true;
  currentUnitName = 'US dollar';
  /*
  Multipliers are strings to avoid losing the precision with large numbers.
  Unit converter changes them into Decimals and calculates them correctly.
  */
  currentUnit: CurrencyUnit = {
    name: 'US dollar',
    abbreviation: '$',
    multiplier: '1',
    isoCode: 'USD'
  };

  constructor(public unitConverter: UnitConverterService, public currencyConverter: CurrencyConverterService) {
  }

  async ngOnInit() {
    /*
    Filter out currency with ISO code USD because it's the base currency.
    The Foreign exchange rates API doesn't allow the base currency in the GET request
    */
    this.currencyConverter.isoCodes = this.currencyConverter.currencies
      .filter((currency: CurrencyUnit) => currency.isoCode !== 'USD')
      .map(({ isoCode }) => isoCode);
    if (Object.keys(this.currencyConverter.exchangeRates).length === 0) {
      this.currencyConverter.exchangeRates = await this.currencyConverter.getExchangeRates(this.currencyConverter.isoCodes);
    }

    await this.currencyConverter.setCurrenciesMultipliers();
  }
}
