import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleService } from '../article.service';


@Component({
    selector: 'app-article-list',
    templateUrl: 'article-list.component.html',
    styleUrls: ['article-list.component.css'],
    providers: [ArticleService]
})
export class ArticleListComponent {


    copyrightYear = '2018';
    articles = [];
    howMany = 0; // # of Articles to get. user input, click
    articlesHowMany = []; // Articles user requested, via button click
    apiUrlStubInApp = ''; // init, create a Property
    titleToDisplay: string;

    articleIJustCreatedBoolean = false;
    articleIJustCreatedDisplay = {};


    addArticleForm: FormGroup;

    constructor(private _myArticleService: ArticleService) { }

    ngOnInit() {

        this.apiUrlStubInApp = this._myArticleService.apiUrlStubInService;

        // this.getAllArticles();
        this._myArticleService.listArticles().subscribe(
            (whatIGot: any[]) => {
                this.articles = whatIGot;
            }
        );

        this.addArticleForm = new FormGroup({
            articleUrl_formControlName: new FormControl(null, Validators.required),
            'articleTitle_formControlName': new FormControl(null, [Validators.required, Validators.minLength(4)])
        });

    }
    runDisplayTitle(event) {
        this.titleToDisplay = event;
    }

    getAllArticlesOnClick(): void {
        this._myArticleService.listArticles()
            .subscribe((whatIGot: any[]) => {
                    this.articlesHowMany = whatIGot;
                }
            );
    }

    clearAllArticlesOnClick(): void {
        this.articlesHowMany = []; // re-init
    }


    getThisManyArticles(numberArticlesPassedIn) {
        /* VALIDATION (however humble)
         - EMPTY INPUT BOX:
         It is an EMPTY STRING "" - when you click submit on empty input.
         - USER TYPES IN 0 or -1
         */

        if (numberArticlesPassedIn.value === "" || numberArticlesPassedIn.value < 1) {
            console.log('Invalid number of articles requested.') // TODO Flash msg or similar
        } else {
            this._myArticleService.listFirstNArticles(numberArticlesPassedIn.value)
                .subscribe(
                    (whatIGot: any[]) => {
                        this.articlesHowMany = whatIGot;
                    }
                );
        }
    }

    preventDefaultOnMouseDownButtonHighlightRemains(event) {
        /* In Chrome at least, the highlight around the clicked
         button remains after the click action is done.
         Seems distracting. Better to remove.
         This "preventDefault()" takes care of that.
         */
        event.preventDefault();

        /* UPDATE
        Sheesh bud, just do it IN-LINE over in the template. Sheesh.

        E.g.,
         <button (click)="clearAllArticlesOnClick()" style="font-style: italic;"
         (mousedown)="$event.preventDefault()">(Clear Articles)</button>

         */
    }

    public addArticle() {
        console.log('we are in addArticle, and whoseiwhatsis is: this.addArticleForm.value ', this.addArticleForm.value);
        /* Yeah. V. nice.
         {articleUrl_formControlName: "http://nytimes.com", articleTitle_formControlName: "We Wrote This Yesterday. (So long as Today is Tomorrow.)"}
         */

        const articleToCreate = {
            articleUrl_name: this.addArticleForm.value.articleUrl_formControlName,
            articleTitle_name: this.addArticleForm.value.articleTitle_formControlName
        };


        /* 2018-04-22 "C" in CRUD time:
         From here in Component TypeScript,
         we invoke the Article Service,
         to use its Angular HTTP (like an Axios),
         to hit the REST API endpoint:
         POST to http://0.0.0.0:8089/articles
         */
        this._myArticleService.createArticle(articleToCreate)
            .subscribe(
                (whatIJustCreated) => {
                    // Observable success
                    console.log('whatIJustCreated ', whatIJustCreated);
                    this.articleIJustCreatedDisplay = whatIJustCreated;
                    this.articleIJustCreatedBoolean = true;
                    // https://stackoverflow.com/questions/36655922/resetting-a-form-in-angular-2-after-submit
                    // Hmm. Seems to say resetForm() should be available o well.
                    this.addArticleForm.reset();
                }
            );
    }

}