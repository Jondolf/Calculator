import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemperatureConverterPage } from './temperature-converter.page';

const routes: Routes = [
  {
    path: '',
    component: TemperatureConverterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemperatureConverterPageRoutingModule {}
