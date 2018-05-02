import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class ArticleService {

  apiUrlStubInService = environment.apiUrlStubInEnvironment;
  /*
   http://0.0.0.0:8089/api/v1/articles/
   http://104.236.198.117:8089/api/v1/articles/
   */

  constructor(private _serviceHttp: HttpClient) {  }

  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
  /* ^^^^^^   TOC   ^^^^^^^^^^^^^  */
  /*

   listArticles()

   listFirstNArticles(howManyToList)

   createArticle(article)

   */
  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */




  // GET All Articles
  listArticles() {
    return this._serviceHttp.get(this.apiUrlStubInService);
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

    console.log("this.apiUrlStubInService + 'first-n?' + nameValuePairNameThing + (equals sign) + howManyToList ", this.apiUrlStubInService + 'first-n?' + nameValuePairNameThing + '=' + howManyToList);


          return this._serviceHttp.get(this.apiUrlStubInService + 'first-n?' + nameValuePairNameThing + '=' + howManyToList);

  }

  createArticle(articleToCreatePassedIn) {

    return this._serviceHttp.post(this.apiUrlStubInService,
      articleToCreatePassedIn
    );
  }

}


