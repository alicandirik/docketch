import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FolderRoutingModule } from './folder-routing.module';
import { FolderListComponent } from './folder-list/folder-list.component';
import { FolderDetailComponent } from './folder-detail/folder-detail.component';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { SharedModule } from '../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';


@NgModule({
  declarations: [FolderListComponent, FolderDetailComponent],
  imports: [
    CommonModule,
    FolderRoutingModule,
    SharedModule,
    NzBackTopModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzDropDownModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class FolderModule { }
