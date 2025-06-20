import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing-module';
import { FormsModule } from '@angular/forms';

// standalone компонент
import { UserPageComponent } from './user-page.component';

@NgModule({
  declarations: [],   // standalone компоненти сюди не додаємо
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    UserPageComponent  // standalone компонент імпортуємо сюди
  ]
})
export class UserModule { }
