import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignRoutingModule } from './sign-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserState } from '../shared/states';
import { NzImageModule } from 'ng-zorro-antd/image';

@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [
    CommonModule,
    SignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzImageModule,
    NzInputModule,
    NzCardModule,
    NzButtonModule,
    NgxsModule.forFeature([UserState])
  ],
  providers: []
})
export class SignModule {}
