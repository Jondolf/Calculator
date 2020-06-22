import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphingCalculatorPage } from './graphing-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: GraphingCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraphingCalculatorPageRoutingModule {}
