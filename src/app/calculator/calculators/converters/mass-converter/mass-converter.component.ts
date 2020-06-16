import { Component } from '@angular/core';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';

@Component({
  selector: 'app-mass-converter',
  templateUrl: './mass-converter.component.html',
  styleUrls: ['./mass-converter.component.scss'],
})
export class MassConverterComponent {
  amount = 1;
  currentUnitName = 'Gram';
  currentUnit: Unit = {
    name: 'Meter',
    abbreviation: 'm',
    multiplier: 1
  };
  massUnits = {
    metric: [
      {
        name: 'Milligram',
        abbreviation: 'mg',
        multiplier: 1000
      },
      {
        name: 'Centigram',
        abbreviation: 'cg',
        multiplier: 100
      },
      {
        name: 'Decigram',
        abbreviation: 'dg',
        multiplier: 10
      },
      {
        name: 'Gram',
        abbreviation: 'g',
        multiplier: 1
      },
      {
        name: 'Decagram',
        abbreviation: 'dag',
        multiplier: 0.1
      },
      {
        name: 'Hectogram',
        abbreviation: 'hg',
        multiplier: 0.01
      },
      {
        name: 'Kilogram',
        abbreviation: 'kg',
        multiplier: 0.001
      }
    ] as Unit[],
    us: [
      {
        name: 'Inch',
        abbreviation: '"',
        multiplier: 39.3700787,
      },
      {
        name: 'Foot',
        abbreviation: 'ft',
        multiplier: 3.2808399,
      },
      {
        name: 'Yard',
        abbreviation: 'yd',
        multiplier: 1.0936133,
      },
      {
        name: 'Mile',
        abbreviation: 'mi',
        multiplier: 0.000621371192
      }
    ] as Unit[]
  };

  constructor(public unitConverter: UnitConverterService) { }
}
