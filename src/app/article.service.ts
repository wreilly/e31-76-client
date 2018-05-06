import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
/* No. See comment at bottom
class ArticleService {
*/
export class ArticleService {

/* Hmm. Not working to "export" (I think) from here inside the
        already-getting-exported class.
        We'll move it outside (bottom of file here), and
        try from there ... ...
*/
/* Interesting development:
- Okay, yes, I can export this "apiUrlStub" out from this Service for
use by Components to do stuff like simply display it to U/I
(tell the user which environment/URL they are using for REST API) = okay
Kind of artificial use, for a dev/test/prototype thing.
- But, I do still really need this "apiUrlStub" right here IN the Service
in earnest, to run all these HTTP calls to the API!

 */
  // apiUrlStubInService = environment.apiUrlStubInEnvironment;
  /*
   http://0.0.0.0:8089/api/v1/articles/
   http://192.168.1.126:8089/api/v1/articles/
   http://104.236.198.117:8089/api/v1/articles/
   */


  constructor(private _serviceHttp: HttpClient) {  }

  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
  /* ^^^^^^   TOC   ^^^^^^^^^^^^^  */
  /*

   // NEW. UTILITY thing. Maybe?
   // Instead I did an export const of it. See bottom of file.
   getApiUrlStubInService() << Did not do.

   listArticles()

   listFirstNArticles(howManyToList)

   getArticle(id)

   createArticle(article)

   updateArticle(id, article)

   deleteArticle(id)

   */
  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */




  // GET All Articles
  listArticles() {
/* No Longer INSIDE the class! Drop the 'this.' Voilà! (a.k.a.: Viola!)
    return this._serviceHttp.get(this.apiUrlStubInService);
*/
    return this._serviceHttp.get(apiUrlStubInService);
  }

  listFirstNArticles(howManyToList) {

    /* (See also REST API api-articles.js Router)
    FINDING/LEARNING:
    - When you do use HTML "form" and "hidden input field" ... You get (for free as it were)
    a **NAME=VALUE** PAIR
        - When you do (like I did) on the Angular "pseudo-form" combo bit, construct all by yourself on your own
    the GET URL to pass a query parameter, you do **NOT** get (for free) that "name=value" pairing.
        What I had done was baldly, blindly, badly JUST SEND THE "value"
    I failed to provide it a "name=" side of things.
        O well.
    */

    const nameValuePairNameThing = 'howMany_query'

    console.log("apiUrlStubInService + 'first-n?' + nameValuePairNameThing + (equals sign) + howManyToList ", apiUrlStubInService + 'first-n?' + nameValuePairNameThing + '=' + howManyToList);


          return this._serviceHttp.get(apiUrlStubInService + 'first-n?' + nameValuePairNameThing + '=' + howManyToList);

  }


  // GET One Article, by ID
  getArticle(idPassedIn) {
    return this._serviceHttp.get(apiUrlStubInService + '/' + idPassedIn);
  }


  createArticle(articleToCreatePassedIn) {

    return this._serviceHttp.post(apiUrlStubInService,
      articleToCreatePassedIn
    );
  }

  updateArticle(idPassedIn, editedArticle) {
    return this._serviceHttp.put(apiUrlStubInService + '/' + idPassedIn, editedArticle)
  }

  deleteArticle(idPassedIn) {
    return this._serviceHttp.delete(apiUrlStubInService + '/' + idPassedIn)
  }

}

/* This does not work. Ah well.
 https://stackoverflow.com/questions/42332456/an-interface-cannot-be-exported-in-an-angular-2-module
 */
/*
 module.exports = ArticleService;
*/

/* Hmm. Furtherance(s).  20180506_0813
 https://stackoverflow.com/questions/33524696/es6-destructuring-and-module-imports
 "The syntax to import a named export is very easily confused for the deconstructing syntax of an object. – Federico Nov 1 '16 at 0:54"

VEC
Very Easily Confused
TWBM
That Would Be Me
;o)


Consider:
--------------
 // react-router.js
 export const Link = 42;
 export default {
 Link: 21,
 };

 // something.js
 import {Link} from './react-router';
 import Router from './react-router';
 const {Link: Link2} = Router;

 console.log(Link); // 42
 console.log(Link2); // 21
 ---------------
 */
export const apiUrlStubInService = environment.apiUrlStubInEnvironment;
/*
 http://0.0.0.0:8089/api/v1/articles/
 http://192.168.1.126:8089/api/v1/articles/
 http://104.236.198.117:8089/api/v1/articles/
 */
