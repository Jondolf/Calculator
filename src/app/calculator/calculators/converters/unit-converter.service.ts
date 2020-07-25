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
      // Convert the amount presicely
      const convertedAmount: Decimal = bigFirstUnitMultiplier.div(bigSecondUnitMultiplier).times(bigAmount);
      const significantDigits = 10;
      const amountOfDigits: number = convertedAmount.toString().replace(/\./g, '').length;
      const roundedConvertedAmount = amountOfDigits > significantDigits
        ? convertedAmount.toPrecision(significantDigits) // If there are more digits than significantDigits, use scientific notation
        : convertedAmount.toFixed(); // Else just remove leftover zeroes
      return roundedConvertedAmount;
    } else {
      return '0';
    }
  }

  // Finds unit from objects by name
  findUnitByName(unitName: string, unitObject: any) {
    // Object.keys gets the names of the sub-objects
    for (const unitCategoryName of Object.keys(unitObject)) {
      // foundUnit stores the found unit if it exists in the object
      const foundUnit = unitObject[unitCategoryName].find(lengthUnit => lengthUnit.name === unitName
        || /* For currency converter */ lengthUnit.isoCode === unitName);
      if (foundUnit) {
        return foundUnit;
      }
    }
  }

  formatUnit(amount: number | string | Decimal): string {
    const amountSplitAtDot = amount.toString().includes('.') ? amount.toString().split('.') : [amount.toString()];
    // Add spaces between digits, but not to the digits e.g. 1 250 010.12504
    const formattedNum = amountSplitAtDot.length === 1
      ? this.addSpacesToNumber(amountSplitAtDot[0])
      : `${this.addSpacesToNumber(amountSplitAtDot[0])}.${amountSplitAtDot[1]}`;
    return formattedNum;
  }

  addSpacesToNumber(num: number | string | Decimal): string {
    // First remove all spaces, then add the correct spaces
    return num.toString().replace(/ /, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
