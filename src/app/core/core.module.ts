import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MusicModule } from 'app/core/music/music.module';
import { PostModule } from 'app/core/post/post.module';
import { ReportService } from 'app/core/report.service';

import { SharedModule } from 'app/shared/shared.module';
import { ApiInterceptor } from 'app/core/api.interceptor';

import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { StoreService } from './store.service';
import { UserService } from './user/user.service';
import { ModalService } from './modal.service';
import { IssueService } from './issue.service';
import { TrackService } from './music/track.service';
import { SocketService } from './socket.service';
import { SwService } from './sw.service';
import { NotificationService } from './notification.service';
import { ApplicationService } from './application.service';
import { CheckoutService } from './checkout.service';
import { ToastService } from './toast.service';
import { CouponService } from 'app/core/coupon.service';
import { ThreadService } from 'app/core/thread.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    PostModule,
  ],
  exports: [
    MusicModule,
  ],
  providers: [
    StoreService,
    UserService,
    AuthService,
    ModalService,
    TrackService,
    IssueService,
    SocketService,
    SwService,
    NotificationService,
    CheckoutService,
    ApplicationService,
    ToastService,
    CouponService,
    ThreadService,
    ReportService,

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
})
export class CoreModule {
}
