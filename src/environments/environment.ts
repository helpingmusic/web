// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  // For service worker
  applicationServerKey: 'BAXlEQ0XcAbXZtnH8Shka_Im72x2ZWK4zMMmnjgqOjWwjJzKzMmY8fG6elz0eEbX2piI-IN8VSMTJSUH1Q-YK4c',

  apiURL: 'http://127.0.0.1:3000',
};
