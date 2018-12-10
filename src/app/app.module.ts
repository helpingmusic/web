import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'jquery';
import { StoreModule } from 'app/store/store.module';

import { GlobalErrorHandler } from './global-error-handler';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// layout
import { MainComponent } from './main/main.component';
import { SideNavComponent } from './main/side-nav/side-nav.component';
import { HeadNavComponent } from './main/head-nav/head-nav.component';
import { RightNavModule } from './main/right-nav/right-nav.module';
import { RerouteGuard } from 'app/reroute.guard';
import { LogoutGuard } from 'app/logout.guard';
import { SearchBarComponent } from 'app/main/head-nav/search-bar/search-bar.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule,
    SharedModule,
    CoreModule,
    AppRoutingModule,
    RightNavModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,

    MainComponent,
    HeadNavComponent,
    SideNavComponent,
    SearchBarComponent,
  ],
  providers: [
    Title,
    RerouteGuard,
    LogoutGuard,
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
