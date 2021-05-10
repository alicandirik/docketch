import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawerComponent } from "./components/drawer/drawer.component";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { LoadingComponent } from "./components/loading/loading.component";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzIconModule } from "ng-zorro-antd/icon";

@NgModule({
  declarations: [DrawerComponent, LoadingComponent],
  imports: [CommonModule, NzDrawerModule, NzSpinModule, NzIconModule],
  exports: [DrawerComponent, LoadingComponent],
})
export class SharedModule {}
