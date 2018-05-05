import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: 'article.component.html',
  styleUrls: ['article.component.css' ]

})
export class ArticleComponent implements OnInit {

  @Input('articleToSendDown') articleHere;

  @Input('apiUrlStubInArticleAlias') apiUrlStubInArticle;
  // i.e., http://0.0.0.0:8089/api/v1/articles/
  // or    http://104.236.198.117:8089/api/v1/articles/

  @Output('myEventEmitterSendTitleAlias') myEventEmitterSendTitle = new EventEmitter();

  articleApiUrlWithId = '';
  // e.g., "http://0.0.0.0:8089/api/v1/articles/5ab99ee11459a61b106a55ff"

  constructor() { }

  ngOnInit() {

    this.articleApiUrlWithId = this.apiUrlStubInArticle + this.articleHere._id;

  }

  sendTitleToParent() {
    console.log('sendTitleToParent hey? this.articleHere.articleTitle: ', this.articleHere.articleTitle);
    this.myEventEmitterSendTitle.emit(this.articleHere.articleTitle);
  }

  preventDefaultOnMouseDownButtonHighlightRemains(event) {
    event.preventDefault(); // We prevent the button highlight (in Chrome)
    /* UPDATE
    Just do it IN-LINE in the Component HTML. Heck.
     */
  }

}
