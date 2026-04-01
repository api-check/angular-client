import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiCheckService, APICHECK_CONFIG, ApiCheckConfig } from './apicheck.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [],
})
export class ApiCheckModule {
  static forRoot(config: ApiCheckConfig): ModuleWithProviders<ApiCheckModule> {
    return {
      ngModule: ApiCheckModule,
      providers: [
        ApiCheckService,
        { provide: APICHECK_CONFIG, useValue: config },
      ],
    };
  }
}
