import { Component } from '@angular/core';
import { UnitConverterService } from '../unit-converter.service';
import Decimal from 'decimal.js';

type TemperatureUnit = {
  name: string;
  abbreviation: string;
  amount: string;
};

@Component({
  selector: 'app-temperature-converter',
  templateUrl: './temperature-converter.page.html',
  styleUrls: ['./temperature-converter.page.scss'],
})
export class TemperatureConverterPage {
  amount = '1';
  currentUnitName = 'Kelvin';
  currentUnit: TemperatureUnit = {
    name: 'Kelvin',
    abbreviation: 'K',
    amount: '1'
  };
  /*
  Amounts are strings to avoid losing the precision with large numbers.
  They are calculated with Decimal.js.
  */
  temperatureUnits = {
    units: [
      {
        name: 'Kelvin',
        abbreviation: 'K',
        amount: this.convertUnit('Kelvin')
      },
      {
        name: 'Celcius',
        abbreviation: '°C',
        amount: this.convertUnit('Celcius')
      },
      {
        name: 'Fahrenheit',
        abbreviation: '°F',
        amount: this.convertUnit('Fahrenheit')
      },
      {
        name: 'Rankine',
        abbreviation: '°Ra',
        amount: this.convertUnit('Rankine')
      },
      {
        name: 'Réaumur',
        abbreviation: '°Re',
        amount: this.convertUnit('Réaumur')
      },
    ] as TemperatureUnit[]
  };

  constructor(public unitConverter: UnitConverterService) { }

  convertUnit(unitName: string): string {
    if (this.amount) {
      const unitAsKelvin: Decimal = this.convertUnitToKelvin(this.currentUnitName, new Decimal(this.amount.toString()));
      console.log(this.amount, unitAsKelvin.toString());
      return this.convertUnitFromKelvin(unitAsKelvin, unitName).toDP(2).toFixed();
    } else {
      return '0';
    }
  }

  convertUnitToKelvin(unitName: string, amount: Decimal): Decimal {
    switch (unitName) {
      case 'Kelvin':
        return amount;
      case 'Celcius':
        return amount.plus('273.15');
      case 'Fahrenheit':
        return amount.plus('459.67').mul(new Decimal('5').div(new Decimal('9')));
      case 'Rankine':
        return amount.mul(new Decimal('5').div(new Decimal('9')));
      case 'Réaumur':
        return amount.div('0.8').plus('273.15');
    }
  }

  convertUnitFromKelvin(kelvinAmount: Decimal, toUnitName: string): Decimal {
    switch (toUnitName) {
      case 'Kelvin':
        return kelvinAmount;
      case 'Celcius':
        return kelvinAmount.minus('273.15');
      case 'Fahrenheit':
        return kelvinAmount.mul(new Decimal('9').div(new Decimal('5'))).minus('459.67');
      case 'Rankine':
        return kelvinAmount.mul(new Decimal('9').div(new Decimal('5')));
      case 'Réaumur':
        return kelvinAmount.minus('273.15').mul('0.8');
    }
  }
}
