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
    path: 'settings',
    loadChildren: () => import('./calculator/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'currency-converter',
    loadChildren: () => import('./calculator/calculators/converters/currency-converter/currency-converter.module')
      .then(m => m.CurrencyConverterPageModule)
  },
  {
    path: 'length-converter',
    loadChildren: () => import('./calculator/calculators/converters/length-converter/length-converter.module')
      .then(m => m.LengthConverterPageModule)
  },
  {
    path: 'mass-converter',
    loadChildren: () => import('./calculator/calculators/converters/mass-converter/mass-converter.module')
      .then(m => m.MassConverterPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
