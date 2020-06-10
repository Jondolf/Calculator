import { Component } from '@angular/core';
import { LengthUnit } from 'src/app/models/length-unit.interface';
import Big from 'big.js';

@Component({
  selector: 'app-length-converter',
  templateUrl: './length-converter.component.html',
  styleUrls: ['./length-converter.component.scss'],
})
export class LengthConverterComponent {
  amount = 1;
  currentUnitName = 'Meter';
  currentUnit: LengthUnit = {
    name: 'Meter',
    abbreviation: 'm',
    multiplier: 1
  };
  lengthUnits = {
    metric: [
      {
        name: 'Millimeter',
        abbreviation: 'mm',
        multiplier: 0.001
      },
      {
        name: 'Centimeter',
        abbreviation: 'cm',
        multiplier: 0.01
      },
      {
        name: 'Decimeter',
        abbreviation: 'dm',
        multiplier: 0.1
      },
      {
        name: 'Meter',
        abbreviation: 'm',
        multiplier: 1
      },
      {
        name: 'Decameter',
        abbreviation: 'dam',
        multiplier: 10
      },
      {
        name: 'Hectometer',
        abbreviation: 'hm',
        multiplier: 100
      },
      {
        name: 'Kilometer',
        abbreviation: 'km',
        multiplier: 1000
      }
    ] as LengthUnit[],
    us: [
      {
        name: 'Inch',
        abbreviation: '"',
        multiplier: 0.0254,
      },
      {
        name: 'Foot',
        abbreviation: 'ft',
        multiplier: 0.3048,
      },
      {
        name: 'Yard',
        abbreviation: 'yd',
        multiplier: 0.9144,
      },
      {
        name: 'Mile',
        abbreviation: 'mi',
        multiplier: 1609.344,
      }
    ] as LengthUnit[]
  };

  countLength(unit: LengthUnit): string {
    this.currentUnit = this.findUnitByName(this.currentUnitName);

    const bigCurrentUnitMultiplier = new Big(this.currentUnit.multiplier);
    const bigUnitMultiplier = new Big(unit.multiplier);
    const bigAmount = this.amount ? new Big(this.amount) : 0;

    if (bigAmount) {
      // Count the length presicely and round it at ten decimals
      const length = new Big(bigCurrentUnitMultiplier.div(bigUnitMultiplier).times(bigAmount).round(10));
      return length.toString() + unit.abbreviation;
    }
    return '0' + unit.abbreviation;
  }

  findUnitByName(unitName: string): LengthUnit {
    // Current unit is gotten from <ionic-select> as a string, so I have to find it by using that name from the lengthUnits array
    return this.lengthUnits.metric.find((lengthUnit: LengthUnit) => lengthUnit.name === unitName)
      ? this.lengthUnits.metric.find((lengthUnit: LengthUnit) => lengthUnit.name === unitName)
      : this.lengthUnits.us.find((lengthUnit: LengthUnit) => lengthUnit.name === unitName);
  }
}
