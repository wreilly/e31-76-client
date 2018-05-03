import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ArticleService } from '../article.service';

// https://www.tektutorialshub.com/angular-passing-parameters-to-route/
// https://stackblitz.com/github/Harvard-DCE-CSCIE3/angular-routing-and-CRUD?file=src%2Fapp%2Fphotodetail%2Fphotodetail.component.ts



@Component({
    selector: 'app-article-detail',
    templateUrl: 'article-detail.component.html',
    styleUrls: ['article-detail.component.css'],
    providers: [ArticleService]
})
export class ArticleDetailComponent {

    theArticleIdHereInDetailPage;
    theArticleHereInDetailPage;

    editing: boolean = false;

    // Passed in, essentially, from ArticleService
    apiUrlStubInThisComponent;

    // Will be filled out (with ID) inside getArticle()
    articleApiUrlWithId;


    subscriptionForId; // reference to the Subscription we create, so that we can also Destroy it

    constructor(
        private _myActivatedRoute: ActivatedRoute,
        private _myArticleService: ArticleService
    ) {  }

    ngOnInit() {
        console.log('ngOnInit this._myArticleService.apiUrlStubInService ', this._myArticleService.apiUrlStubInService); // undefined. hmm.
        this.apiUrlStubInThisComponent = this._myArticleService.apiUrlStubInService;
        this.getArticle();
    }

    getArticle(): void {

        this.subscriptionForId = this._myActivatedRoute.params.subscribe(
            (paramsIGot) => {
                // data... In the case of an ActivatedRoute, what it sends back when you subscribe is the Params (apparently). Bueno.
                // Note: This param name ('article_id') is set in the app.module.ts appRoutes
                this.theArticleIdHereInDetailPage = paramsIGot['article_id']

                this.articleApiUrlWithId = this.apiUrlStubInThisComponent + this.theArticleIdHereInDetailPage;

                // Now, here, right inside the SUBSCRIBE (Observable) to get the ID,
                // let us directly proceed, with that freshly gotten ID, to
                // go ahead right here and use the articleIdParam to now
                // go get the Article from the Service.
                // (That is, by contrast, I had first thought these lines of code would
                //   go *down below* the whole tri-part "subscribe" thing.
                //   That first intuition was NOT RIGHT.)
                this._myArticleService.getArticle(this.theArticleIdHereInDetailPage)
                    .subscribe(
                        (articleIGot) => {
                            // data...
                            this.theArticleHereInDetailPage = articleIGot;
                            console.log('subscribe : this.theArticleHereInDetailPage ', this.theArticleHereInDetailPage) // Yes: the object {} from MongoDB
                        },
                        (error) => {
                            // error
                            console.log('subscribe get Article Error: ', error)
                        },
                        () => {
                            // done
                        }
                    )
            },
            (errorIThink) => {
                // error
                console.log('subscribe get Param Id Error: ', errorIThink)
            },
            () => {
                // done
            }
        );
    } // /getArticle()


    toggleEdit() {
        console.log('letUsEdit ', this.editing)
        this.editing = this.editing ? false : true; // toggle. if true, make false. And vice versa
    }

    letUsSave(whatIsPassedIn) {
        console.log('we are saving ... theArticleHereInDetailPage._id ', this.theArticleHereInDetailPage._id)
        console.log('whatIsPassedIn ', whatIsPassedIn)
    }

    letUsDelete() {
        console.log('we are deleting ...theArticleHereInDetailPage._id ', this.theArticleHereInDetailPage._id)
    }

    ngOnDestroy() {
        this.subscriptionForId.unsubscribe();
    }
}