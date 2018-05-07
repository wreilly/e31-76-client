import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleService, apiUrlStubInService } from '../article.service';


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

/* WORKED. When apiUrlStub etc. was INSIDE the exported class:
        this.apiUrlStubInApp = this._myArticleService.apiUrlStubInService;
*/
// Now (for heck of it and/or learning), trying to import and use as mere const:
        this.apiUrlStubInApp = apiUrlStubInService

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

    public addArticle(addArticleFormTemplate_refPassedIn) {
        console.log('addArticle - now OverLoading: both REACTIVE and TEMPLATE')
        // N.B. Only the TEMPLATE mode needs to pass in a parameter.

        console.log('addArticleFormTemplate_refPassedIn: (TEMPLATE only) ', addArticleFormTemplate_refPassedIn);
        /* Yes:
         {articleUrl_name: "http://nytimes.com", articleTitle_name: "TEMPLATE We Wrote This Yesterday. (So long as Today is Tomorrow.)"}
         */

        console.log('we are in addArticle - this.addArticleForm.value (REACT only) ', this.addArticleForm.value);
        /* Yeah. V. nice.
         {articleUrl_formControlName: "http://nytimes.com", articleTitle_formControlName: "REACTIVE We Wrote This Yesterday. (So long as Today is Tomorrow.)"}
         */

        let articleToCreate = {
            articleUrl_name: '',
            articleTitle_name: ''
        };

        if (addArticleFormTemplate_refPassedIn) {
            // TEMPLATE-DRIVEN
            articleToCreate = {
                articleUrl_name: addArticleFormTemplate_refPassedIn.articleUrl_name,
                articleTitle_name: addArticleFormTemplate_refPassedIn.articleTitle_name
            };
        } else {
            // REACTIVE-MODEL-DRIVEN
            articleToCreate = {
                articleUrl_name: this.addArticleForm.value.articleUrl_formControlName,
                articleTitle_name: this.addArticleForm.value.articleTitle_formControlName
            };
        }



        /* 2018-04-22 "C" in CRUD time:

         From here in the Component's TypeScript,
         we invoke the Article Service,
         to use its Angular HTTP (like the Axios we used in the Express App),
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

                    // New: Let's update the Articles array right here, right now.
                    // Also: The user-selected "How Many Articles" array.
                    // On create here, I do *not* refresh the page,
                    //  because I wanted to immediately display the just-created article.
                    //  Till now I had not thought to do this array-pushing.
                    //  Instead, the user had to refresh or perhaps navigate back
                    //  to this page, to see full list with newly added item.
                    //  This is better.
                    this.articles.push(this.articleIJustCreatedDisplay)
                    if (this.articlesHowMany.length) {
                        // If the user has NOT clicked on "First n" Articles,
                        //  we'll skip adding the just-created Article to that
                        //  (non-existent) list on the page.
                        //
                        // That is, only if the user *HAS* already asked for some number
                        // of Articles to appear will we add the
                        // just-created Article to that displayed list:
                        this.articlesHowMany.push(this.articleIJustCreatedDisplay)
                        /*
                         One tiny side-effect (totally benign, acceptable, and prob. desired):
                         re: "articlesHowMany":
                         - If user says "Display first 2 articles", and then adds one article...
                         - The "First n" articles list of 2 will be joined by the new one, in the
                         next spot (3rd spot)
                         (whereas it of course belongs ultimately in last spot)
                         - That of course goes away next time they click on asking for any other
                         number of articles to be displayed.
                         (The newly added one will correctly be in the last spot.)
                         */
                    } else {
                        // do nothing. User had *not* clicked on "Display First n".
                        // We do not add the just-created Article to a sort of "non-list"
                    }

                    // https://stackoverflow.com/questions/36655922/resetting-a-form-in-angular-2-after-submit
                    // Hmm. Seems to say resetForm() should be available o well.
                    this.addArticleForm.reset();
                }
            );
    }

}