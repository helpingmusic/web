import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CouponFieldComponent } from 'app/shared/coupon-field.component';
import { HomeMaterialModule } from 'app/shared/home-material/home-material.module';
import { CardInputComponent } from 'app/shared/payment/card-input.component';
import { PaymentFieldComponent } from 'app/shared/payment/payment-field.component';
import { Pipes } from 'app/shared/pipes';
import { TagInputComponent } from 'app/shared/tag-input/tag-input.component';
import { ImageCropperModule } from 'ng2-img-cropper';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AudioInputComponent } from './audio-input/audio-input.component';
import { ControlsComponent } from './controls/controls.component';
import { DatetimeRangePickerComponent } from './datetime-range-picker.component';

import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { HomeBtnComponent } from './home-btn.component';
import { ImgUploaderComponent } from './img-uploader/img-uploader.component';
import { LoaderComponent } from './loader/loader.component';
import { NoteBoxComponent } from './note-box.component';
import { OauthBtnComponent } from './oauth-btn/oauth-btn.component';
import { PanelComponent } from './panel/panel.component';
import { PasswordMatcherDirective } from './password-matcher.directive';
import { StateSelectorDirective } from './state-selector.directive';
import { SuccessIconComponent } from './success-icon.component';
import { CommentBoxComponent } from './thread/comment-box.component';
import { ThreadCommentComponent } from './thread/thread-comment/thread-comment.component';
import { ThreadComponent } from './thread/thread.component';
import { TimePickerDirective } from './time-picker.directive';
import { PrismicDomPipe } from './prismic-dom.pipe';
import { PromptModalComponent } from './prompt-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ImageCropperModule,
    HomeMaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HeroBannerComponent,
    ControlsComponent,
    LoaderComponent,
    HomeBtnComponent,
    PasswordMatcherDirective,
    StateSelectorDirective,
    TimePickerDirective,
    OauthBtnComponent,
    PanelComponent,
    SuccessIconComponent,
    AudioInputComponent,
    NoteBoxComponent,
    DatetimeRangePickerComponent,
    ImgUploaderComponent,
    ThreadComponent,
    ThreadCommentComponent,
    CommentBoxComponent,
    TagInputComponent,
    ...Pipes,
    PrismicDomPipe,
    CardInputComponent,
    PaymentFieldComponent,
    PromptModalComponent,
    CouponFieldComponent,
  ],
  entryComponents: [
    LoaderComponent,
    PromptModalComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,

    HomeMaterialModule,
    ImageCropperModule,
    InfiniteScrollModule,
    CouponFieldComponent,

    ...Pipes,
    PrismicDomPipe,

    PasswordMatcherDirective,
    StateSelectorDirective,
    TimePickerDirective,

    TagInputComponent,
    HeroBannerComponent,
    ControlsComponent,
    LoaderComponent,
    HomeBtnComponent,
    OauthBtnComponent,
    PanelComponent,
    SuccessIconComponent,
    AudioInputComponent,
    NoteBoxComponent,
    DatetimeRangePickerComponent,
    ImgUploaderComponent,
    ThreadComponent,
    ThreadCommentComponent,
    CommentBoxComponent,
    PaymentFieldComponent,
    PromptModalComponent,
  ],
})
export class SharedModule {
}
