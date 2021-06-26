import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MathButtonsComponent } from './math-buttons/math-buttons.component';
import { MathInputComponent } from './math-input/math-input.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [MathInputComponent, MathButtonsComponent],
  exports: [MathInputComponent, MathButtonsComponent]
})
export class MathModule { }
