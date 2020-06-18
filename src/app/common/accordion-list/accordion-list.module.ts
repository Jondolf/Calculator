import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AccordionListComponent } from './accordion-list.component';

@NgModule({
  declarations: [AccordionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [AccordionListComponent]
})
export class AccordionListModule { }
