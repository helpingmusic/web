import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HomeMaterialModule } from 'app/shared/home-material/home-material.module';
import { Pipes } from 'app/shared/pipes';
import { StripeInputComponent } from 'app/shared/stripe-input.component';
import { TagInputComponent } from 'app/shared/tag-input/tag-input.component';
import { BsModalModule } from 'ng2-bs3-modal';
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
    StripeInputComponent,
    NoteBoxComponent,
    DatetimeRangePickerComponent,
    ImgUploaderComponent,
    ThreadComponent,
    ThreadCommentComponent,
    CommentBoxComponent,
    TagInputComponent,
    ...Pipes,
  ],
  entryComponents: [
    LoaderComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,

    HomeMaterialModule,
    ImageCropperModule,
    BsModalModule,
    InfiniteScrollModule,

    ...Pipes,

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
    StripeInputComponent,
    NoteBoxComponent,
    DatetimeRangePickerComponent,
    ImgUploaderComponent,
    ThreadComponent,
    ThreadCommentComponent,
    CommentBoxComponent,
  ],
})
export class SharedModule {
}
