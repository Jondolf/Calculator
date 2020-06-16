import Decimal from 'decimal.js';
// a general interface for units like length, weight, currency...
export interface Unit {
  name: string;
  abbreviation: string;
  // For each type of unit I choose a base unit (like meter) and that chooses the multiplier for each unit (cm = 100, km = 0.001)
  multiplier: number | string | Decimal;
  [x: string]: any;
}
