import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTOR_PROVIDERS } from './index';
import { CookieService, ErrorService } from '../shared/services';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [HTTP_INTERCEPTOR_PROVIDERS, CookieService, ErrorService]
})
export class HttpModule {}
