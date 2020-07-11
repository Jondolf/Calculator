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
      name: 'Bulgarian lev',
      abbreviation: 'лв.',
      multiplier: '-1',
      isoCode: 'BGN'
    },
    {
      name: 'Brazilian real',
      abbreviation: 'R$',
      multiplier: '-1',
      isoCode: 'BRL'
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
      name: 'Czech koruna',
      abbreviation: 'Kč',
      multiplier: '-1',
      isoCode: 'CZK'
    },
    {
      name: 'Danish krone',
      abbreviation: 'kr',
      multiplier: '-1',
      isoCode: 'DKK'
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
      name: 'Croatian kuna',
      abbreviation: 'kn',
      multiplier: '-1',
      isoCode: 'HRK'
    },
    {
      name: 'Hungarian forint',
      abbreviation: 'Ft',
      multiplier: '-1',
      isoCode: 'HUF'
    },
    {
      name: 'Indonesian rupiah',
      abbreviation: 'Rp',
      multiplier: '-1',
      isoCode: 'IDR'
    },
    {
      name: 'Israeli shekel',
      abbreviation: '₪',
      multiplier: '-1',
      isoCode: 'ILS'
    },
    {
      name: 'Indian rupee',
      abbreviation: '₹',
      multiplier: '-1',
      isoCode: 'INR'
    },
    {
      name: 'Icelandic krona',
      abbreviation: 'kr',
      multiplier: '-1',
      isoCode: 'ISK'
    },
    {
      name: 'Japanese yen',
      abbreviation: '¥',
      multiplier: '-1',
      isoCode: 'JPY'
    },
    {
      name: 'South Korean won',
      abbreviation: '₩',
      multiplier: '-1',
      isoCode: 'KRW'
    },
    {
      name: 'Mexican peso',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'MXN'
    },
    {
      name: 'Malaysian ringgit',
      abbreviation: 'RM',
      multiplier: '-1',
      isoCode: 'MYR'
    },
    {
      name: 'Norwegian krone',
      abbreviation: 'kr',
      multiplier: '-1',
      isoCode: 'NOK'
    },
    {
      name: 'New Zealand dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'NZD'
    },
    {
      name: 'Philippine peso',
      abbreviation: '₱',
      multiplier: '-1',
      isoCode: 'PHP'
    },
    {
      name: 'Polish zloty',
      abbreviation: 'zł',
      multiplier: '-1',
      isoCode: 'PLN'
    },
    {
      name: 'Romanian leu',
      abbreviation: 'lei',
      multiplier: '-1',
      isoCode: 'RON'
    },
    {
      name: 'Russian rouble',
      abbreviation: '₽',
      multiplier: '-1',
      isoCode: 'RUB'
    },
    {
      name: 'Swedish krona',
      abbreviation: 'kr',
      multiplier: '-1',
      isoCode: 'SEK'
    },
    {
      name: 'Singapore dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'SGD'
    },
    {
      name: 'Thai baht',
      abbreviation: '฿',
      multiplier: '-1',
      isoCode: 'THB'
    },
    {
      name: 'Turkish lira',
      abbreviation: '₺',
      multiplier: '-1',
      isoCode: 'TRY'
    },
    {
      name: 'US dollar',
      abbreviation: '$',
      multiplier: '-1',
      isoCode: 'USD'
    },
    {
      name: 'South African rand',
      abbreviation: 'R',
      multiplier: '-1',
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
