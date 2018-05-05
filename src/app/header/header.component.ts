import { Component } from '@angular/core';

// This next line did not work, to just import some part of the Service ("deconstruct").
// import { apiUrlStubInService } from '../article.service'

// We bring in whole Service, just to get one property out of it: enviroment-specific URL(stub)
import { ArticleService } from '../article.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ArticleService]
})
export class HeaderComponent {

  weekNumber = 14;
  assignmentNumber = this.weekNumber / 2; // 7!


  constructor(private _myArticleService: ArticleService) { }

  apiUrlStubHereInHeader = this._myArticleService.apiUrlStubInService;
  // http://192.168.1.126:8089/api/v1/articles/
  // http://192.168.1.126:8089/ << What we want.
  // We'll find "api/v1" for the index of where to slice to. Cheers.
  // https://www.digitalocean.com/community/tutorials/how-to-index-split-and-manipulate-strings-in-javascript
  expressAppUrlHereInHeader = this.apiUrlStubHereInHeader
      .slice(0, this.apiUrlStubHereInHeader
          .indexOf("api/v1"))

}
