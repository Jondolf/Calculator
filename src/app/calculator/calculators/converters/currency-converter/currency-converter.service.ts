import { Injectable } from '@angular/core';
import { CurrencyUnit } from './currency-converter.page';
import axios from 'axios';
import { UnitConverterService } from '../unit-converter.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {
  exchangeRates = {};
  isoCodes = [];
  mostTradedIsoCodes = ['AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'JPY', 'NZD', 'USD'];

  /*
  Multipliers are set by setMostTradedCurrencies.
  Multipliers are strings to avoid losing the precision with large numbers.
  Unit converter changes them into Decimals and calculates them correctly.
  */
  currencies: CurrencyUnit[] = [
    {
      name: 'Australian dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'AUD'
    },
    {
      name: 'Canadian dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'CAD'
    },
    {
      name: 'Swiss franc',
      abbreviation: 'Fr.',
      multiplier: '-1',
      isoCode: 'CHF'
    },
    {
      name: 'Chinese yuan',
      abbreviation: '¥',
      multiplier: '-1',
      isoCode: 'CNY'
    },
    {
      name: 'Euro',
      abbreviation: '€',
      multiplier: '1',
      isoCode: 'EUR'
    },
    {
      name: 'British pound',
      abbreviation: '£',
      multiplier: '-1',
      isoCode: 'GBP'
    },
    {
      name: 'Hong Kong dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'HKD'
    },
    {
      name: 'Japanese yen',
      abbreviation: '¥',
      multiplier: '-1',
      isoCode: 'JPY'
    },
    {
      name: 'New Zealand dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'NZD'
    },
    {
      name: 'US dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'USD'
    }
  ];

  mostTradedCurrencies = {
    // Filter out all currencies that are not in the mostTradedIsoCodes array
    currencies: this.currencies.filter((currency: CurrencyUnit) => this.mostTradedIsoCodes.includes(currency.isoCode))
  };

  constructor(public unitConverter: UnitConverterService) { }

  async setCurrenciesMultipliers() {
    for (const isoCode of this.isoCodes) {
      // Get currency with ISO code
      const currency = this.unitConverter.findUnitByName(isoCode, { currencies: this.currencies });
      // Set the currency's multiplier with the multiplier found from exchangeRates
      currency.multiplier = this.exchangeRates[currency.isoCode].toString();
    }
  }

  /**
   * Gets exchange rates using the Foreign exchange rates API (https://exchangeratesapi.io/)
   */
  async getExchangeRates(isoCodes: string[]): Promise<number> {
    try {
      const response = await axios.get(`https://api.exchangeratesapi.io/latest?symbols=${isoCodes.join(',')}`);
      return response.data.rates;
    } catch (error) {
      throw new Error(error);
    }
  }
}
