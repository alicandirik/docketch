import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { NgxsModule } from "@ngxs/store";
import { HttpModule } from "./http/http.module";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./core/core.module";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { en_US, NZ_I18N } from "ng-zorro-antd/i18n";
import { environment } from "src/environments";
import { NotificationState } from "./shared/states";
import { AuthService } from "./shared/services";

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzNotificationModule,
    CoreModule,
    HttpModule,
    HttpClientModule,
    ...environment.plugins,
    NgxsModule.forRoot([NotificationState], {
      developmentMode: !environment.production,
    }),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
