// a general interface for units like length, weight, currency...
export interface Unit {
  name: string;
  abbreviation: string;
  // For each type of unit I choose a base unit (like meter) and that chooses the multiplier for each unit (cm = 0.01, km = 1000)
  multiplier: number;
  [x: string]: any;
}
