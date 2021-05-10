import { NgModule, SecurityContext } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MasterRoutingModule } from "./master-routing.module";
import { MasterComponent } from "./master.component";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NgxsModule } from "@ngxs/store";
import {
  FolderState,
  LoadingState,
  NoteState,
  UserState,
} from "../shared/states";
import { CoreModule } from "../core/core.module";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzCardModule } from "ng-zorro-antd/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzBackTopModule } from "ng-zorro-antd/back-top";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzAutocompleteModule } from "ng-zorro-antd/auto-complete";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { MarkdownModule } from "ngx-markdown";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [MasterComponent],
  imports: [
    CommonModule,
    CoreModule,
    MasterRoutingModule,
    NzLayoutModule,
    NzButtonModule,
    NzInputModule,
    NzMenuModule,
    NzAvatarModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzBackTopModule,
    FormsModule,
    NzCardModule,
    NzDrawerModule,
    NzAutocompleteModule,
    NzFormModule,
    NzPageHeaderModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.STYLE
    }),
    NgxsModule.forFeature([UserState, FolderState, NoteState, LoadingState]),
  ],
})
export class MasterModule {}
