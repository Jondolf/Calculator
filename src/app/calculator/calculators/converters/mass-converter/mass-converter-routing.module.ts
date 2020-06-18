import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MassConverterPage } from './mass-converter.page';

const routes: Routes = [
  {
    path: '',
    component: MassConverterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassConverterPageRoutingModule { }
