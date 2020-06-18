import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LengthConverterPage } from './length-converter.page';

const routes: Routes = [
  {
    path: '',
    component: LengthConverterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LengthConverterPageRoutingModule { }
