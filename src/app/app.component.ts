import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


import { stripePubKey } from 'app/globals';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';

declare const Stripe: any;

@Component({
  selector: 'home-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
  ) {
  }

  ngOnInit() {
    // Set page title on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),)
      .subscribe((event) => {
        let t;
        if (event.title) {
          t = event.title + ' | Helping Our Music Evolve';
        } else {
          t = 'Helping Our Music Evolve';
        }
        this.titleService.setTitle(t);
        this.handleLabelAutopopulate();
      });

    // Set stripe key
    if (Stripe || (<any>window).Stripe) {
      (<any>window).stripe = (Stripe || (<any>window).Stripe)(stripePubKey);
    }

    if (environment.production) {
      this.auth.getCurrentUser()
        .subscribe(u => (<any>window).addFBPixel(u.email));
    }
  }

  handleLabelAutopopulate() {

    // Handle input autopopulate and floating labels
    setTimeout(() => {
      const groups = document.querySelectorAll('.label-floating');

      Array.prototype.slice.call(groups)
        .forEach(g => {
          const input = g.querySelector('input');
          if (input && input.value) g.classList.remove('is-empty');
        });

    }, 10);
  }


}
