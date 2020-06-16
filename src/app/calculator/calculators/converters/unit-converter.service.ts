import { Injectable } from '@angular/core';
import { Unit } from 'src/app/models/unit.interface';
import Decimal from 'decimal.js';

@Injectable({
  providedIn: 'root'
})
export class UnitConverterService {
  // Converts a unit to a different unit, adds the corresponding abbreviation and returns it
  convertUnit(firstUnit: Unit, secondUnit: Unit, amount: number | string): string {
    // Create new Big instances of the given parameters for counting precisely
    const bigFirstUnitMultiplier = new Decimal(firstUnit.multiplier);
    const bigSecondUnitMultiplier = new Decimal(secondUnit.multiplier);
    const bigAmount = amount ? new Decimal(amount) : 0;

    if (bigAmount) {
      // Count the length presicely and round it at ten decimals
      const length = new Decimal(bigFirstUnitMultiplier.div(bigSecondUnitMultiplier).times(bigAmount)).toFixed();
      return length.toString() + firstUnit.abbreviation;
    } else {
      return '0' + firstUnit.abbreviation;
    }
  }

  // Finds unit from objects by name
  findUnitByName(unitName: string, unitObject: any): Unit {
    // Object.keys gets the names of the sub-objects
    for (const unitCategoryName of Object.keys(unitObject)) {
      // foundUnit stores the found unit if it exists in the object
      const foundUnit: Unit = unitObject[unitCategoryName].find((lengthUnit: Unit) => lengthUnit.name === unitName
        || /* For currency converter */ lengthUnit.isoCode === unitName);
      if (foundUnit) {
        return foundUnit;
      }
    }
  }
}
