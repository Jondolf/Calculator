import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccordionListComponent } from './accordion-list/accordion-list.component';
import { GlassCardComponent } from './glass-card/glass-card.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [AccordionListComponent, GlassCardComponent],
  exports: [AccordionListComponent, GlassCardComponent]
})
export class CommonComponentsModule { }
