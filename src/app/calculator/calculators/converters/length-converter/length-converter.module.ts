import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { LengthConverterPageRoutingModule } from './length-converter-routing.module';
import { LengthConverterPage } from './length-converter.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LengthConverterPageRoutingModule,
    CommonComponentsModule
  ],
  declarations: [LengthConverterPage]
})
export class LengthConverterPageModule { }
