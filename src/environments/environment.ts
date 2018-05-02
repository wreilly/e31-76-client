// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  apiUrlStubInEnvironment: 'http://0.0.0.0:8089/api/v1/articles/' // << Don't forget final '/' !

  // Test up on Digital Ocean:
  // apiUrlStubInEnvironment: 'http://104.236.198.117:8089/api/v1/articles/' // << Don't forget final '/' !

  /* D.O.
   http://104.236.198.117:8089/api/v1/articles/5ac5eeba45ed983e8a8a209e
   */

};
