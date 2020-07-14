import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BasicCalculatorPage } from './calculator/calculators/basic-calculator/basic-calculator.page';

const routes: Routes = [
  { path: '', redirectTo: 'basic-calculator', pathMatch: 'full' },
  {
    path: 'basic-calculator',
    component: BasicCalculatorPage
  },
  {
    path: 'length-converter',
    loadChildren: () => import('./calculator/calculators/converters/length-converter/length-converter.module')
      .then(m => m.LengthConverterPageModule)
  },
  {
    path: 'temperature-converter',
    loadChildren: () => import('./calculator/calculators/converters/temperature-converter/temperature-converter.module')
      .then(m => m.TemperatureConverterPageModule)
  },
  {
    path: 'mass-converter',
    loadChildren: () => import('./calculator/calculators/converters/mass-converter/mass-converter.module')
      .then(m => m.MassConverterPageModule)
  },
  {
    path: 'currency-converter',
    loadChildren: () => import('./calculator/calculators/converters/currency-converter/currency-converter.module')
      .then(m => m.CurrencyConverterPageModule)
  },
  {
    path: 'charts',
    loadChildren: () => import('./calculator/calculators/charts/charts.module').then(m => m.ChartsPageModule)
  },
  {
    path: 'graphing-calculator',
    loadChildren: () => import('./calculator/calculators/graphing-calculator/graphing-calculator.module')
      .then(m => m.GraphingCalculatorPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
