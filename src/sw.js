'use strict';


self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});


/**
 * Cache handling
 */
var CACHE_NAME = 'HOME.cache.v1';
var urlsToCache = [
  '/assets/images/home-login-logo.png',
  '/assets/images/profile-bg-material.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});


// Save token for authenticated calls
self.addEventListener('message', e => self.token = e.data.token);

self.addEventListener('push', function (event) {
  console.log(event);

  let promiseChain = Promise.resolve();

  const headers = new Headers({
    'Authorization': 'Bearer ' + self.token,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  });

  if (event.data) {
    promiseChain = Promise.resolve(event.data.json());

  } else { // no payload data because chrome is stupid
    // Fetch notification data if needed
    promiseChain = promiseChain
      .then(() => {
        let query = {
          where: {read: false},
          limit: 1,
        };
        const queryString = Object.keys(query)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
          .join('&');

        return fetch(`/users/me/notifications/?${queryString}`, {
          method: 'get',
          credentials: 'same-origin',
          headers: headers,
        })
          .then(res => res.json()[0]);
      })
  }

  promiseChain = promiseChain.then(n => {
      self.registration.showNotification(n.title, {
        body: trimDescription(n.description),
        icon: '/assets/images/home-login-logo.png',
        badge: '/assets/images/home-logo-icon-white.png',
        data: n,
        timestamp: new Date(n.createdAt),
      })
    });

  event.waitUntil(promiseChain);
});

// If description is too long trim it
function trimDescription(desc) {
  if (!desc) return '';

  if (desc.length > 120) {
    return desc.splice(0, 120) + '...';
  }
  return desc;
}

self.addEventListener('notificationclick', function(event) {
  const notification = event.notification;
  notification.close();

  const urlToOpen = new URL(notification.data.link, self.location.origin);

  const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = windowClients
        .find(w => w.url.indexOf(urlToOpen.origin) === 0);

      if (matchingClient) {
        matchingClient.navigate(urlToOpen.href);
        matchingClient.focus()
      } else {
        clients.openWindow(urlToOpen)
      }
    });

  event.waitUntil(promiseChain);
});
