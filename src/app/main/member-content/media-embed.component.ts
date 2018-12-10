import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import flvjs from 'flv.js/dist/flv.min.js';


@Component({
  selector: 'home-media-embed',
  template: `
    <iframe type="text/html"
      *ngIf="src && type !== 'stream'"
      [width]="width"
      [height]="height"
      [src]="src"
      frameborder="0">
    </iframe>
    
    <video controls [hidden]="type !== 'stream'"
           [width]="width"
           [height]="height"
           #videoEl></video>
  `,
  styles: [`
    :host {
      max-width: 100%;
      overflow: hidden;
      position: relative;
      display: block;
      text-align: center;
    }
    iframe {
      margin: 0 auto;
      display: inline-block;
      max-width: 100%;
    }
    video {
      margin: 0 auto;
      display: inline-block;
      max-width: 100%;
    }
  `],
})
export class MediaEmbedComponent implements OnInit, OnChanges {
  @Input() scale = 1;

  @Input() url: string;
  @Input() type: string;
  @Input() mediumId: string;

  src: SafeUrl;
  width = 640;
  height = 360;
  @ViewChild('videoEl') videoEl: any;

  youtubeQueryParams = {
    controls: 0,
    // showinfo: 0,
    modestbranding: 1,
    rel: 0,
  };

  constructor(
    private santizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(c) {
    this.parseSrc();

    if (this.type === 'stream') {
      try {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: `wss://rtmp.evolvemusic.org:8443/live/${this.mediumId}`
        });
        flvPlayer.attachMediaElement(this.videoEl.nativeElement);
        flvPlayer.load();
        flvPlayer.play();
      } catch (e) {
        // temporarily mute output
        console.log(e);
      }
    }

    if (c.scale) {
      // Multiply scale by default dimensions
      this.width = c.scale * 640;
      this.height = c.scale * 360;
    }
  }

  parseSrc() {
    if (!this.type || !this.mediumId) return;

    let src;
    switch (this.type) {
      case 'youtube':
        let query = Object.keys(this.youtubeQueryParams)
          .map(k => `${k}=${this.youtubeQueryParams[k]}`)
          .join('&');
        src = `https://www.youtube.com/embed/${this.mediumId}?${query}`;
        break;

      case 'vimeo':
        src = `https://player.vimeo.com/video/${this.mediumId}`;
        break;

      default:
        src = this.url;
        break;
    }

    this.src = this.santizer.bypassSecurityTrustResourceUrl(src);
  }
}
