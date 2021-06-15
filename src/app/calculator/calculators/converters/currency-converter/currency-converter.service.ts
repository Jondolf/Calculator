import { Injectable } from '@angular/core';
import axios from 'axios';
import { UnitConverterService } from '../unit-converter.service';
import { CurrencyUnit } from './currency-converter.page';
import { appId } from './open-exchange-rates-app-id.js';

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
      name: 'Bulgarian lev',
      abbreviation: 'лв.',
      multiplier: 'NaN',
      isoCode: 'BGN'
    },
    {
      name: 'Brazilian real',
      abbreviation: 'R$',
      multiplier: 'NaN',
      isoCode: 'BRL'
    },
    {
      name: 'Canadian dollar',
      abbreviation: '$',
      multiplier: 'NaN',
      isoCode: 'CAD'
    },
    {
      name: 'Swiss franc',
      abbreviation: 'Fr.',
      multiplier: 'NaN',
      isoCode: 'CHF'
    },
    {
      name: 'Chinese yuan',
      abbreviation: '¥',
      multiplier: 'NaN',
      isoCode: 'CNY'
    },
    {
      name: 'Czech koruna',
      abbreviation: 'Kč',
      multiplier: 'NaN',
      isoCode: 'CZK'
    },
    {
      name: 'Danish krone',
      abbreviation: 'kr',
      multiplier: 'NaN',
      isoCode: 'DKK'
    },
    {
      name: 'Euro',
      abbreviation: '€',
      multiplier: 'NaN',
      isoCode: 'EUR'
    },
    {
      name: 'British pound',
      abbreviation: '£',
      multiplier: 'NaN',
      isoCode: 'GBP'
    },
    {
      name: 'Hong Kong dollar',
      abbreviation: '$',
      multiplier: 'NaN',
      isoCode: 'HKD'
    },
    {
      name: 'Croatian kuna',
      abbreviation: 'kn',
      multiplier: 'NaN',
      isoCode: 'HRK'
    },
    {
      name: 'Hungarian forint',
      abbreviation: 'Ft',
      multiplier: 'NaN',
      isoCode: 'HUF'
    },
    {
      name: 'Indonesian rupiah',
      abbreviation: 'Rp',
      multiplier: 'NaN',
      isoCode: 'IDR'
    },
    {
      name: 'Israeli shekel',
      abbreviation: '₪',
      multiplier: 'NaN',
      isoCode: 'ILS'
    },
    {
      name: 'Indian rupee',
      abbreviation: '₹',
      multiplier: 'NaN',
      isoCode: 'INR'
    },
    {
      name: 'Icelandic krona',
      abbreviation: 'kr',
      multiplier: 'NaN',
      isoCode: 'ISK'
    },
    {
      name: 'Japanese yen',
      abbreviation: '¥',
      multiplier: 'NaN',
      isoCode: 'JPY'
    },
    {
      name: 'South Korean won',
      abbreviation: '₩',
      multiplier: 'NaN',
      isoCode: 'KRW'
    },
    {
      name: 'Mexican peso',
      abbreviation: '$',
      multiplier: 'NaN',
      isoCode: 'MXN'
    },
    {
      name: 'Malaysian ringgit',
      abbreviation: 'RM',
      multiplier: 'NaN',
      isoCode: 'MYR'
    },
    {
      name: 'Norwegian krone',
      abbreviation: 'kr',
      multiplier: 'NaN',
      isoCode: 'NOK'
    },
    {
      name: 'New Zealand dollar',
      abbreviation: '$',
      multiplier: 'NaN',
      isoCode: 'NZD'
    },
    {
      name: 'Philippine peso',
      abbreviation: '₱',
      multiplier: 'NaN',
      isoCode: 'PHP'
    },
    {
      name: 'Polish zloty',
      abbreviation: 'zł',
      multiplier: 'NaN',
      isoCode: 'PLN'
    },
    {
      name: 'Romanian leu',
      abbreviation: 'lei',
      multiplier: 'NaN',
      isoCode: 'RON'
    },
    {
      name: 'Russian rouble',
      abbreviation: '₽',
      multiplier: 'NaN',
      isoCode: 'RUB'
    },
    {
      name: 'Swedish krona',
      abbreviation: 'kr',
      multiplier: 'NaN',
      isoCode: 'SEK'
    },
    {
      name: 'Singapore dollar',
      abbreviation: '$',
      multiplier: 'NaN',
      isoCode: 'SGD'
    },
    {
      name: 'Thai baht',
      abbreviation: '฿',
      multiplier: 'NaN',
      isoCode: 'THB'
    },
    {
      name: 'Turkish lira',
      abbreviation: '₺',
      multiplier: 'NaN',
      isoCode: 'TRY'
    },
    {
      name: 'US dollar',
      abbreviation: '$',
      multiplier: '1',
      isoCode: 'USD'
    },
    {
      name: 'South African rand',
      abbreviation: 'R',
      multiplier: 'NaN',
      isoCode: 'ZAR'
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
   * Gets exchange rates using the open exchange rates API (https://openexchangerates.org/)
   */
  async getExchangeRates(isoCodes: string[]): Promise<number> {
    try {
      const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=${isoCodes.join(',')}`);
      return response.data.rates;
    } catch (error) {
      throw new Error(error);
    }
  }
}
