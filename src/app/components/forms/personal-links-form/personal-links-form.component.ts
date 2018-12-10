import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators as val } from '@angular/forms';
import { PersonalLinks } from 'app/components/forms/personal-links-form/personal-links';

@Component({
  selector: 'home-personal-links-form',
  templateUrl: './personal-links-form.component.html',
  styleUrls: ['./personal-links-form.component.scss']
})
export class PersonalLinksFormComponent implements OnInit {

  links = [
    { title: 'Personal Site', icon: 'fa-suitcase', name: 'site' },
    { title: 'LinkedIn', icon: 'fa-linkedin', name: 'linkedin' },
    { title: 'Facebook', icon: 'fa-facebook', name: 'facebook' },
    { title: 'Instagram', icon: 'fa-instagram', name: 'instagram' },
    { title: 'Twitter', icon: 'fa-twitter', name: 'twitter' },
    { title: 'Soundcloud', icon: 'fa-soundcloud', name: 'soundcloud' },
    { title: 'Spotify', icon: 'fa-spotify', name: 'spotify' },
    { title: 'Youtube', icon: 'fa-youtube', name: 'youtube' },
  ];

  @Input() form: FormGroup;

  constructor( ) { }

  ngOnInit() {
  }

  static build(links: Partial<PersonalLinks> = {}) {
    const urlValidate = val.pattern('^(https?:\\/\\/)?([a-zA-Z0-9]+(\\.[a-zA-Z0-9]{2,5})+.*)$');

    return new FormGroup({
      site: new FormControl(links.site, [urlValidate]),
      linkedin: new FormControl(links.linkedin, [urlValidate]),
      facebook: new FormControl(links.facebook, [urlValidate]),
      instagram: new FormControl(links.instagram, [urlValidate]),
      twitter: new FormControl(links.twitter, [urlValidate]),
      soundcloud: new FormControl(links.soundcloud, [urlValidate]),
      spotify: new FormControl(links.spotify, [urlValidate]),
      youtube: new FormControl(links.youtube, [urlValidate]),
    })
  }

}
