import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  amount = 1;
  showOnlyMostTraded = true;
  currentUnitName = 'Euro';
  currentUnit: Unit = {
    name: 'Euro',
    abbreviation: '€',
    multiplier: 1
  };

  // multipliers are set by setMostTradedCurrencies
  mostTradedCurrencies = {
    currencies: [
      {
        name: 'Australian dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'AUD'
      },
      {
        name: 'Canadian dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'CAD'
      },
      {
        name: 'Swiss franc',
        abbreviation: 'Fr.',
        multiplier: -1,
        isoCode: 'CHF'
      },
      {
        name: 'Chinese yuan',
        abbreviation: '¥',
        multiplier: -1,
        isoCode: 'CNY'
      },
      {
        name: 'Euro',
        abbreviation: '€',
        multiplier: -1,
        isoCode: 'EUR'
      },
      {
        name: 'British pound',
        abbreviation: '£',
        multiplier: -1,
        isoCode: 'GBP'
      },
      {
        name: 'Hong Kong dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'HKD'
      },
      {
        name: 'Japanese yen',
        abbreviation: '¥',
        multiplier: -1,
        isoCode: 'JPY'
      },
      {
        name: 'New Zealand dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'NZD'
      },
      {
        name: 'US dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'USD'
      }
    ] as Unit[]
  };
  // TODO Add more currencies here
  allCurrencies = {
    currencies: [
      {
        name: 'Australian dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'AUD'
      },
      {
        name: 'Canadian dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'CAD'
      },
      {
        name: 'Swiss franc',
        abbreviation: 'Fr.',
        multiplier: -1,
        isoCode: 'CHF'
      },
      {
        name: 'Chinese yuan',
        abbreviation: '¥',
        multiplier: -1,
        isoCode: 'CNY'
      },
      {
        name: 'Euro',
        abbreviation: '€',
        multiplier: -1,
        isoCode: 'EUR'
      },
      {
        name: 'British pound',
        abbreviation: '£',
        multiplier: -1,
        isoCode: 'GBP'
      },
      {
        name: 'Hong Kong dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'HKD'
      },
      {
        name: 'Japanese yen',
        abbreviation: '¥',
        multiplier: -1,
        isoCode: 'JPY'
      },
      {
        name: 'New Zealand dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'NZD'
      },
      {
        name: 'US dollar',
        abbreviation: '$',
        multiplier: -1,
        isoCode: 'USD'
      }
    ] as Unit[]
  };

  constructor(public unitConverter: UnitConverterService) {
  }

  async ngOnInit() {
    this.setMostTradedCurrencies();
    this.setAllCurrencies();
  }

  /*
  sets the mostTradedCurrencies object.
  I set it with a function instead of in the variable declaration itself because I didn't manage to make
  asynchronous function calls work.
  TODO Figure out a way to set the value from the object itself to be DRY
  */
  async setMostTradedCurrencies() {
    const mostTradedCurrencies = {
      currencies: [
        {
          name: 'Australian dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('AUD')).toString(),
          isoCode: 'AUD'
        },
        {
          name: 'Canadian dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('CAD')).toString(),
          isoCode: 'CAD'
        },
        {
          name: 'Swiss franc',
          abbreviation: 'Fr.',
          multiplier: +(await this.getSpecificExchangeRate('CHF')).toString(),
          isoCode: 'CHF'
        },
        {
          name: 'Chinese yuan',
          abbreviation: '¥',
          multiplier: +(await this.getSpecificExchangeRate('CNY')).toString(),
          isoCode: 'CNY'
        },
        {
          name: 'Euro',
          abbreviation: '€',
          multiplier: 1,
          isoCode: 'EUR'
        },
        {
          name: 'British pound',
          abbreviation: '£',
          multiplier: +(await this.getSpecificExchangeRate('GBP')).toString(),
          isoCode: 'GBP'
        },
        {
          name: 'Hong Kong dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('HKD')).toString(),
          isoCode: 'HKD'
        },
        {
          name: 'Japanese yen',
          abbreviation: '¥',
          multiplier: +(await this.getSpecificExchangeRate('JPY')).toString(),
          isoCode: 'JPY'
        },
        {
          name: 'New Zealand dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('NZD')).toString(),
          isoCode: 'NZD'
        },
        {
          name: 'US dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('USD')).toString(),
          isoCode: 'USD'
        }
      ] as Unit[]
    };
    this.mostTradedCurrencies = mostTradedCurrencies;
  }

  /*
  sets the allCurrencies object.
  I set it with a function instead of in the variable declaration itself because I didn't manage to make
  asynchronous function calls work.
  TODO Figure out a way to set the value from the object itself to be DRY
  */
  async setAllCurrencies() {
    const allCurrencies = {
      currencies: [
        {
          name: 'Australian dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('AUD')).toString(),
          isoCode: 'AUD'
        },
        {
          name: 'Canadian dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('CAD')).toString(),
          isoCode: 'CAD'
        },
        {
          name: 'Swiss franc',
          abbreviation: 'Fr.',
          multiplier: +(await this.getSpecificExchangeRate('CHF')).toString(),
          isoCode: 'CHF'
        },
        {
          name: 'Chinese yuan',
          abbreviation: '¥',
          multiplier: +(await this.getSpecificExchangeRate('CNY')).toString(),
          isoCode: 'CNY'
        },
        {
          name: 'Euro',
          abbreviation: '€',
          multiplier: 1,
          isoCode: 'EUR'
        },
        {
          name: 'British pound',
          abbreviation: '£',
          multiplier: +(await this.getSpecificExchangeRate('GBP')).toString(),
          isoCode: 'GBP'
        },
        {
          name: 'Hong Kong dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('HKD')).toString(),
          isoCode: 'HKD'
        },
        {
          name: 'Japanese yen',
          abbreviation: '¥',
          multiplier: +(await this.getSpecificExchangeRate('JPY')).toString(),
          isoCode: 'JPY'
        },
        {
          name: 'New Zealand dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('NZD')).toString(),
          isoCode: 'NZD'
        },
        {
          name: 'US dollar',
          abbreviation: '$',
          multiplier: +(await this.getSpecificExchangeRate('USD')).toString(),
          isoCode: 'USD'
        }
      ] as Unit[]
    };
    this.allCurrencies = allCurrencies;
  }

  // gets exchange rates using the Foreign exchange rates API (https://exchangeratesapi.io/)
  async getSpecificExchangeRate(isoCode: string): Promise<number> {
    try {
      const response = await axios.get(`https://api.exchangeratesapi.io/latest?symbols=${isoCode}`);
      return response.data.rates[isoCode];
    } catch (error) {
      throw new Error(error);
    }
  }
}
