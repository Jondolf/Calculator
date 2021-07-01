import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { MassConverterPageRoutingModule } from './mass-converter-routing.module';
import { MassConverterPage } from './mass-converter.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MassConverterPageRoutingModule,
    CommonComponentsModule
  ],
  declarations: [MassConverterPage]
})
export class MassConverterPageModule { }
