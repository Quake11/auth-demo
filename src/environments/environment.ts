// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAKfW--gRU7KsHRgFVzV1QzI9tv41u8ZOI',
    authDomain: 'auth-demo-de0bb.firebaseapp.com',
    databaseURL: 'https://auth-demo-de0bb.firebaseio.com',
    projectId: 'auth-demo-de0bb',
    storageBucket: 'auth-demo-de0bb.appspot.com',
    messagingSenderId: '848807435601'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
