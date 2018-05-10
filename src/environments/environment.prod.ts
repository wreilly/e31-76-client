
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// BUILD info
// https://github.com/angular/angular-cli/wiki/build

export const environment = {
  production: true,


  // A. To TEST "PROD" build, *using* LOCAL: A) Client, B) API:
  //  1. With Local Client Angular App...
  //     do PROD "build":  ng build --env=prod
  //  2. Then run Local Client Angular App,
  // To do that: You need an HTTP server.
  // Use a plain HTTP server to serve up the /dist
  /*
   $ python --version
   Python 2.7.10
   $ which python
   /usr/bin/python
   cd ./dist
   $ python -m SimpleHTTPServer 8000
   Serving HTTP on 0.0.0.0 port 8000 ...
   http://0.0.0.0:8000/
   */
  //  3. And with line below have it point to **LOCAL** API

  /*
  apiUrlStubInEnvironment: 'http://0.0.0.0:8089/api/v1/articles/' // << Don't forget final '/' !
*/
  /*
   // NEW: Basically same stub, for <IMG SRC="" />
   imgUrlStubInEnvironment: 'http://0.0.0.0:8089/' // << Yep, final '/'
   */


  // Remember, you could also use this, for that SUBNET stuff. Kitchen table, 2nd computer. Cheers.
  /*
  apiUrlStubInEnvironment: 'http://192.168.1.126:8089/api/v1/articles/' // << Don't forget final '/' !
  */
  /*
   // NEW: Basically same stub, for <IMG SRC="" />
   imgUrlStubInEnvironment: 'http://192.168.1.126:8089/' // << Yep, final '/'
   */


  // B. For PROD USE up on Digital Ocean:
  /* */
  apiUrlStubInEnvironment: 'http://104.236.198.117:8089/api/v1/articles/', // << Don't forget final '/' !


  /* */
   // NEW: Basically same stub, for <IMG SRC="" />
   imgUrlStubInEnvironment: 'http://104.236.198.117:8089/' // << Yep, final '/'



  /* D.O.
   http://104.236.198.117:8089/api/v1/articles/5ac5eeba45ed983e8a8a209e
   */


};
