// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// BUILD info
// https://github.com/angular/angular-cli/wiki/build

export const environment = {
  production: false,

  /* *** -1- ****** 0.0.0.0  ************* */
  // LOCALHOST 0.0.0.0
  // USE ANYWHERE ... (E.g., on Harvard campus, in some coffee shop, etc.)
  // Also yes CAN be used "at home" simply.
  // Runs on local machine only.
/* */
  apiUrlStubInEnvironment: 'http://0.0.0.0:8089/api/v1/articles/' // << Don't forget final '/' !


  /* *** -2- ****** 192.168.1.126  ************* */
  // SUBNET "LOCAL" 192.168.1.126 << sometimes changes to .125
  //   $ ifconfig | grep 192
  //   inet 192.168.1.126 netmask 0xffffff00 broadcast 192.168.1.255
  // Lets me see app and GET ARTICLES, on **2nd Macintosh** here on kitchen table...
  // USE AT HOME (100 Gore) (if/when you wish to use another computer to see app in browser)
  // Do NOT use outside the home, off of the SubNet. App may run but API part won't work!
  // See Also note below re: PACKAGE.JSON
/*
  apiUrlStubInEnvironment: 'http://192.168.1.126:8089/api/v1/articles/' // << Don't forget final '/' !
*/



  /* *** -3- *******  104.236.198.117  ************ */
  // Test up on Digital Ocean:
  //
  // To test A) LOCAL "dev" Client, pointing to B) *PROD* API:
  // 1. With Local Client Angular App...
  //    simply run ng serve
  //    That "ng serve" simply uses this default environment.ts ("local"). okay.
  // 2. And with line below have this Local DEV Client point to **PROD / D.O.** API


  // To test a "Local" environment.ts BUILD, using A) LOCAL Client, pointing to B) *PROD* API:
  // 1. With Local Client Angular App...
  //    do a "build" ng build  (defaults to "local" build)
  //    That "ng build" simply uses this default environment.ts ("local"). okay.
  // 2. HTTP - Interesting. Then, because a BUILT Angular Client on its own is kinda useless...
  //    (You have to have a plain old web server, to serve it up!)
  // So, to that end, we can use a plain Python simple HTTP server to serve up the /dist
  /*
   $ which python
   /usr/bin/python
   $ python --version
   Python 2.7.10
    cd ./dist
   $ python -m SimpleHTTPServer 8000
   Serving HTTP on 0.0.0.0 port 8000 ...
   http://0.0.0.0:8000/
   Voilà!
   */
  // 3. And then with line below you can have this Local BUILT Client point to **PROD / D.O.** API

  // Note: (parenthetical) If what you want to do is: To test a true "PROD" build,
  // well, with your "build" command, you will be pointing
  // not to this environment.ts, but
  //   over to environment.prod.ts
  // $ npm run build  That is, --> $ ng build --env=prod
  //  // https://github.com/angular/angular-cli/wiki/build
  // Go see that file instead ... :)


  /*
  apiUrlStubInEnvironment: 'http://104.236.198.117:8089/api/v1/articles/' // << Don't forget final '/' !
  */

  /* D.O.
   http://104.236.198.117:8089/api/v1/articles/5ac5eeba45ed983e8a8a209e
   */

};

/* PACKAGE.JSON note:

 "scripts": {
   "ng": "ng",
   "my-fake-comment-in-json": "this start line with host 0.0.0.0 is what makes the client app work okay from a 2nd computer on the subnet in my house e.g. 192.168.1.126:4206 hooray for that. See Also /environments/environment.ts re: apiUrlStub...",
   "start": "ng serve --host 0.0.0.0",
   "build": "ng build --prod",
 ...}


 FURTHER NOTE:
 "name": "e31-assignment-08-ng-client-no-cors-wreilly",
 "scripts": {
   "ng": "ng",
   "start": "ng serve",
   "build": "ng build --env=prod",
   "buildlocal": "ng build",

 */
