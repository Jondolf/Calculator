import { Component } from '@angular/core';
import { Unit } from 'src/app/models/unit.interface';
import { UnitConverterService } from '../unit-converter.service';

@Component({
  selector: 'app-length-converter',
  templateUrl: './length-converter.page.html',
  styleUrls: ['./length-converter.page.scss'],
})
export class LengthConverterPage {
  amount = '1';
  currentUnitName = 'Meter';
  currentUnit: Unit = {
    name: 'Meter',
    abbreviation: 'm',
    multiplier: '1'
  };
  /*
  Multipliers are strings to avoid losing the precision with large numbers.
  Unit converter changes them into Decimals and calculates them correctly.
  */
  lengthUnits = {
    metric: [
      {
        name: 'Yoctometer',
        abbreviation: 'ym',
        multiplier: '1000000000000000000000000'
      },
      {
        name: 'Zeptometer',
        abbreviation: 'zm',
        multiplier: '1000000000000000000000'
      },
      {
        name: 'Attometer',
        abbreviation: 'am',
        multiplier: '1000000000000000000'
      },
      {
        name: 'Femtometer',
        abbreviation: 'fm',
        multiplier: '1000000000000000'
      },
      {
        name: 'Picometer',
        abbreviation: 'pm',
        multiplier: '1000000000000'
      },
      {
        name: 'Nanometer',
        abbreviation: 'nm',
        multiplier: '1000000000'
      },
      {
        name: 'Micrometer',
        abbreviation: 'μm',
        multiplier: '1000000'
      },
      {
        name: 'Millimeter',
        abbreviation: 'mm',
        multiplier: '1000'
      },
      {
        name: 'Centimeter',
        abbreviation: 'cm',
        multiplier: '100'
      },
      {
        name: 'Decimeter',
        abbreviation: 'dm',
        multiplier: '10'
      },
      {
        name: 'Meter',
        abbreviation: 'm',
        multiplier: '1'
      },
      {
        name: 'Decameter',
        abbreviation: 'dam',
        multiplier: '0.1'
      },
      {
        name: 'Hectometer',
        abbreviation: 'hm',
        multiplier: '0.01'
      },
      {
        name: 'Kilometer',
        abbreviation: 'km',
        multiplier: '0.001'
      },
      {
        name: 'Megameter',
        abbreviation: 'Mm',
        multiplier: '0.000001'
      },
      {
        name: 'Gigameter',
        abbreviation: 'Gm',
        multiplier: '0.000000001'
      },
      {
        name: 'Terameter',
        abbreviation: 'Tm',
        multiplier: '0.000000000001'
      },
      {
        name: 'Petameter',
        abbreviation: 'Pm',
        multiplier: '0.000000000000001'
      },
      {
        name: 'Exameter',
        abbreviation: 'Em',
        multiplier: '0.000000000000000001'
      },
      {
        name: 'Zettameter',
        abbreviation: 'Zm',
        multiplier: '0.000000000000000000001'
      },
      {
        name: 'Yottameter',
        abbreviation: 'Ym',
        multiplier: '0.000000000000000000000001'
      }
    ] as Unit[],
    us: [
      {
        name: 'Thou',
        abbreviation: 'th',
        multiplier: '39370.0787'
      },
      {
        name: 'Inch',
        abbreviation: 'in',
        multiplier: '39.3700787'
      },
      {
        name: 'Foot',
        abbreviation: 'ft',
        multiplier: '3.2808399'
      },
      {
        name: 'Yard',
        abbreviation: 'yd',
        multiplier: '1.0936133'
      },
      {
        name: 'Chain',
        abbreviation: 'ch',
        multiplier: '0.0497096954'
      },
      {
        name: 'Furlong',
        abbreviation: 'fur',
        multiplier: '0.00497096954'
      },
      {
        name: 'Mile',
        abbreviation: 'mi',
        multiplier: '0.000621371192'
      },
      {
        name: 'League',
        abbreviation: 'lea',
        multiplier: '0.000179985601'
      }
    ] as Unit[]
  };

  constructor(public unitConverter: UnitConverterService) { }
}
