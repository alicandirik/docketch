import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NoteNewRoutingModule } from "./note-new-routing.module";
import { NoteListComponent } from "./note-list/note-list.component";
import { NoteDetailComponent } from "./note-detail/note-detail.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MarkdownModule } from "ngx-markdown";
import { NzBackTopModule } from "ng-zorro-antd/back-top";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NgxsModule } from "@ngxs/store";
import { NoteState } from "../shared/states";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [NoteListComponent, NoteDetailComponent],
  imports: [
    CommonModule,
    NoteNewRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NzBackTopModule,
    NzInputModule,
    NzDrawerModule,
    NzButtonModule,
    NzFormModule,
    NzPageHeaderModule,
    NzDropDownModule,
    NzSpinModule,
    NzSelectModule,
    NzModalModule,
    MarkdownModule.forChild(),
    NgxsModule.forFeature([NoteState]),
  ],
})
export class NoteNewModule {}
