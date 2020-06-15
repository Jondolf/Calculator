import { Injectable } from '@angular/core';
import Big from 'big.js';
import { Unit } from 'src/app/models/unit.interface';

@Injectable({
  providedIn: 'root'
})
export class UnitConverterService {
  // converts a unit to a different unit, adds the corresponding abbreviation and returns it
  convertUnit(firstUnit: Unit, secondUnit: Unit, amount: number): string {
    // create new Big instances of the given parameters for counting precisely
    const bigFirstUnitMultiplier = new Big(firstUnit.multiplier);
    const bigSecondUnitMultiplier = new Big(secondUnit.multiplier);
    const bigAmount = amount ? new Big(amount) : 0;

    if (bigAmount) {
      // count the length presicely and round it at ten decimals
      const length = new Big(bigFirstUnitMultiplier.div(bigSecondUnitMultiplier).times(bigAmount).round(10));
      return length.toString() + firstUnit.abbreviation;
    } else {
      return '0' + firstUnit.abbreviation;
    }
  }

  // finds unit from objects by name
  findUnitByName(unitName: string, unitObject: any): Unit {
    // Object.keys gets the names of the sub-objects
    for (const unitCategoryName of Object.keys(unitObject)) {
      // foundUnit stores the found unit if it exists in the object
      const foundUnit: Unit = unitObject[unitCategoryName].find((lengthUnit: Unit) => lengthUnit.name === unitName);
      if (foundUnit) {
        return foundUnit;
      }
    }
  }
}
