import { Component } from '@angular/core';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';

@Component({
  selector: 'app-length-converter',
  templateUrl: './length-converter.component.html',
  styleUrls: ['./length-converter.component.scss'],
})
export class LengthConverterComponent {
  amount = 1;
  currentUnitName = 'Meter';
  currentUnit: Unit = {
    name: 'Meter',
    abbreviation: 'm',
    multiplier: 1
  };
  lengthUnits = {
    metric: [
      {
        name: 'Millimeter',
        abbreviation: 'mm',
        multiplier: 1000
      },
      {
        name: 'Centimeter',
        abbreviation: 'cm',
        multiplier: 100
      },
      {
        name: 'Decimeter',
        abbreviation: 'dm',
        multiplier: 10
      },
      {
        name: 'Meter',
        abbreviation: 'm',
        multiplier: 1
      },
      {
        name: 'Decameter',
        abbreviation: 'dam',
        multiplier: 0.1
      },
      {
        name: 'Hectometer',
        abbreviation: 'hm',
        multiplier: 0.01
      },
      {
        name: 'Kilometer',
        abbreviation: 'km',
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
