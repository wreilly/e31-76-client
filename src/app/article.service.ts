import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
/* No. See comment at bottom
class ArticleService {
*/
export class ArticleService {

/*  FOR URL "STUBS" SEE BOTTOM OF PAGE

Hmm. Not working to "export" (I think) from here inside the
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


    createArticle(myFormFieldsAndFiles) {  // UPDATE: << This is now FormData, not just a plain object with form fields for an Article
      /*
       createArticle(articleToCreatePassedIn) {
       */

/*
      console.log('HERE IN THE SOIVICE articleToCreatePassedIn is ', articleToCreatePassedIn) // Yes we have the pics
*/
      console.log('HERE IN THE SOIVICE myFormFieldsAndFiles is ', myFormFieldsAndFiles) // you won't see this FormData here....


      var myxhr4 = new XMLHttpRequest;
      myxhr4.open('POST', '/myFormFieldsAndFilesInService', true);
      myxhr4.send(myFormFieldsAndFiles);
      /* YES:
       ------WebKitFormBoundaryq80IEBooD6GEetmo
       Content-Disposition: form-data; name="articleUrl_name"

       http://nytimes.com
       ------WebKitFormBoundaryq80IEBooD6GEetmo
       Content-Disposition: form-data; name="articleTitle_name"

       gt
       ------WebKitFormBoundaryq80IEBooD6GEetmo
       Content-Disposition: form-data; name="articlePhotos_name"

       C:\fakepath\010006-MexAmerican.jpg
       ------WebKitFormBoundaryq80IEBooD6GEetmo
       Content-Disposition: form-data; name="file"

       C:\fakepath\010006-MexAmerican.jpg
       ------WebKitFormBoundaryq80IEBooD6GEetmo--
       */


      /*
      return this._serviceHttp.post(apiUrlStubInService,
          articleToCreatePassedIn
      );
      */
/* This IS has been the standard POST '/' endpoint for this service method... */
      return this._serviceHttp.post(apiUrlStubInService,
         myFormFieldsAndFiles
      );

/*  We will try instead doing POST '/articleimages'
* Why?
* Because with above we have not been seing that Multer is writing the file down to /public/img/filegoeshere...   Hmm.
* */
/* NOPE DON'T WORK for the "Submit Form" button click.
      return this._serviceHttp.post(apiUrlStubInService + 'articleimages',
          myFormFieldsAndFiles
      );*/
  }

  uploadArticleImages(myFormDataFilesHere) {
    // This, God willing, runs first, off the "Choose File" button
    // to just upload images to the REST API which uses Multer to stow them
    // in /public/img
    // Then, the createArticle would get run. Hmm.
    // Maybe on 2nd thought, more ideal would be:
    // 1st pass, do get the image files info, but, do NOT go off to REST API / Multer etc.
    // Instead, wait for user to click Submit
    // Then stitch together into FormData both 1) that images files info and 2) fielded data
    // *Then* go to REST API with all that and let Multer do magic with files,
    // and let rest of controller/service etc. write fielded data to MongoDB. Hmm.

    // Well, we'll give plan A a short shot here, then come back for 'B' as in Better.
    return this._serviceHttp.post(apiUrlStubInService + 'articleimages', myFormDataFilesHere);

  } // /uploadArticleImages()

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

// NEW: Basically same stub, for <IMG SRC="" />
export const imgUrlStubInService = environment.imgUrlStubInEnvironment;
/*
  http://0.0.0.0:8089/
  http://192.168.1.126:8089/
  http://104.236.198.117:8089/
 */
