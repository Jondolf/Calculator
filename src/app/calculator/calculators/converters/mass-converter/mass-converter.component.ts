import { Component } from '@angular/core';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';

@Component({
  selector: 'app-mass-converter',
  templateUrl: './mass-converter.component.html',
  styleUrls: ['./mass-converter.component.scss'],
})
export class MassConverterComponent {
  amount = '1';
  currentUnitName = 'Gram';
  currentUnit: Unit = {
    name: 'Meter',
    abbreviation: 'm',
    multiplier: '1'
  };
  /*
  Multipliers are strings to avoid losing the precision with large numbers.
  Unit converter changes them into Decimals and calculates them correctly.
  */
  massUnits = {
    metric: [
      {
        name: 'Yoctogram',
        abbreviation: 'yg',
        multiplier: '1000000000000000000000'
      },
      {
        name: 'Zeptogram',
        abbreviation: 'zg',
        multiplier: '1000000000000000000'
      },
      {
        name: 'Attogram',
        abbreviation: 'ag',
        multiplier: '1000000000000000'
      },
      {
        name: 'Femtogram',
        abbreviation: 'fg',
        multiplier: '1000000000000'
      },
      {
        name: 'Picogram',
        abbreviation: 'pg',
        multiplier: '1000000000'
      },
      {
        name: 'Nanogram',
        abbreviation: 'ng',
        multiplier: '1000000000'
      },
      {
        name: 'Microgram',
        abbreviation: 'µg',
        multiplier: '1000000'
      },
      {
        name: 'Milligram',
        abbreviation: 'mg',
        multiplier: '1000'
      },
      {
        name: 'Centigram',
        abbreviation: 'cg',
        multiplier: '100'
      },
      {
        name: 'Decigram',
        abbreviation: 'dg',
        multiplier: '10'
      },
      {
        name: 'Gram',
        abbreviation: 'g',
        multiplier: '1'
      },
      {
        name: 'Decagram',
        abbreviation: 'dag',
        multiplier: '0.1'
      },
      {
        name: 'Hectogram',
        abbreviation: 'hg',
        multiplier: '0.01'
      },
      {
        name: 'Kilogram',
        abbreviation: 'kg',
        multiplier: '0.001'
      },
      {
        name: 'Megagram',
        abbreviation: 'Mg',
        multiplier: '0.000001'
      },
      {
        name: 'Gigagram',
        abbreviation: 'Gg',
        multiplier: '0.000000001'
      },
      {
        name: 'Teragram',
        abbreviation: 'Tg',
        multiplier: '0.000000000001'
      },
      {
        name: 'Petagram',
        abbreviation: 'Pg',
        multiplier: '0.000000000000001'
      },
      {
        name: 'Exagram',
        abbreviation: 'Eg',
        multiplier: '0.000000000000000001'
      },
      {
        name: 'Zettagram',
        abbreviation: 'Zg',
        multiplier: '0.000000000000000000001'
      },
      {
        name: 'Yottagram',
        abbreviation: 'Yg',
        multiplier: '0.000000000000000000000001'
      }
    ] as Unit[],
    us: [
      {
        name: 'Pound',
        abbreviation: 'lb',
        multiplier: '0.00220462262',
      },
      {
        name: 'Ounce',
        abbreviation: 'oz',
        multiplier: '0.0352739619'
      }
    ] as Unit[]
  };

  constructor(public unitConverter: UnitConverterService) { }
}
